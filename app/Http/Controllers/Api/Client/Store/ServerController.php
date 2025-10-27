<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\Egg;
use Pterodactyl\Models\Location;
use Pterodactyl\Models\Node;
use Pterodactyl\Models\UserCredit;
use Pterodactyl\Models\CreditTransaction;
use Pterodactyl\Models\Invoice;
use Pterodactyl\Models\InvoiceItem;
use Pterodactyl\Models\UserBillingPreference;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Services\Servers\ServerCreationService;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Mail\InvoiceGenerated;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class ServerController extends ClientApiController
{
    protected ServerCreationService $creationService;

    public function __construct(ServerCreationService $creationService)
    {
        parent::__construct();
        $this->creationService = $creationService;
    }

    /**
     * Create a new server from the store.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|min:1|max:191',
            'egg_id' => 'required|integer|exists:eggs,id',
            'location_id' => 'required|integer|exists:locations,id',
            'memory' => 'required|integer|min:256',
            'disk' => 'required|integer|min:512',
            'cpu' => 'required|integer|min:50',
            'databases' => 'nullable|integer|min:0|max:10',
            'allocations' => 'nullable|integer|min:1|max:5',
            'backups' => 'nullable|integer|min:0|max:10',
        ]);

        $user = $request->user();
        $egg = Egg::with('variables')->findOrFail($validated['egg_id']);
        $location = Location::findOrFail($validated['location_id']);
        
        // Build environment variables with defaults
        $environment = [];
        foreach ($egg->variables as $variable) {
            $environment[$variable->env_variable] = $variable->default_value;
        }

        // Find available node in the location
        $node = Node::where('location_id', $location->id)
            ->where('public', true)
            ->whereRaw('(memory - memory_overallocate) >= ?', [$validated['memory']])
            ->whereRaw('(disk - disk_overallocate) >= ?', [$validated['disk']])
            ->first();

        if (!$node) {
            throw new DisplayException('No available nodes in the selected location with enough resources.');
        }

        // Find an available allocation on the node
        $allocation = $node->allocations()->whereNull('server_id')->first();
        
        if (!$allocation) {
            throw new DisplayException('No available IP allocations on the selected node. Please contact an administrator.');
        }

        // Calculate monthly price (simplified - should match cart logic)
        $pricePerGB = 2; // $2/GB RAM
        $storagePerGB = 0.40; // $0.40/GB storage
        $monthlyPrice = ($validated['memory'] / 1024 * $pricePerGB) + ($validated['disk'] / 1024 * $storagePerGB);

        // Handle payment/credits
        $subtotal = $monthlyPrice;
        $creditsApplied = 0;
        
        // Check if user wants to auto-use credits
        $preferences = UserBillingPreference::where('user_id', $user->id)->first();
        $autoUseCredits = $preferences ? $preferences->auto_use_credits : true;

        if ($autoUseCredits) {
            $userCredit = UserCredit::where('user_id', $user->id)->first();
            if ($userCredit && $userCredit->credits > 0) {
                $dollarValue = $userCredit->credits * 0.10;
                $creditsToUse = min($dollarValue, $monthlyPrice);
                $creditsCount = (int) ceil($creditsToUse / 0.10);

                // Apply credits
                $userCredit->credits -= $creditsCount;
                $userCredit->save();

                CreditTransaction::create([
                    'user_id' => $user->id,
                    'amount' => -$creditsCount,
                    'dollar_value' => -$creditsToUse,
                    'type' => 'payment',
                    'description' => "Initial payment for {$validated['name']}",
                ]);

                $creditsApplied = $creditsToUse;
            }
        }

        $finalAmount = $subtotal - $creditsApplied;

        // Create the server
        try {
            $server = $this->creationService->handle([
                'name' => $validated['name'],
                'owner_id' => $user->id,
                'egg_id' => $egg->id,
                'node_id' => $node->id,
                'allocation_id' => $allocation->id,
                'allocation_additional' => [],
                'memory' => $validated['memory'],
                'disk' => $validated['disk'],
                'cpu' => $validated['cpu'],
                'swap' => 0,
                'io' => 500,
                'threads' => null,
                'image' => array_values($egg->docker_images)[0] ?? 'ghcr.io/pterodactyl/yolks:latest',
                'startup' => $egg->startup,
                'environment' => $environment,
                'databases' => $validated['databases'] ?? 0,
                'allocations' => $validated['allocations'] ?? 1,
                'backups' => $validated['backups'] ?? 0,
                'start_on_completion' => false,
                'oom_disabled' => false,
            ]);

            // Create invoice
            $invoice = Invoice::create([
                'invoice_number' => Invoice::generateInvoiceNumber(),
                'user_id' => $user->id,
                'server_id' => $server->id,
                'subtotal' => $subtotal,
                'credits_used' => $creditsApplied,
                'total' => $finalAmount,
                'status' => $finalAmount <= 0 ? 'paid' : 'pending',
                'due_date' => Carbon::now()->addDays(7),
                'paid_at' => $finalAmount <= 0 ? now() : null,
                'description' => "Initial setup for {$server->name}",
            ]);

            // Add invoice items
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => "Server Setup - {$server->name}",
                'unit_price' => $subtotal,
                'quantity' => 1,
                'total' => $subtotal,
            ]);

            // Send email if user has email notifications enabled
            if ($preferences && $preferences->email_invoices) {
                try {
                    Mail::to($user)->send(new InvoiceGenerated($invoice));
                } catch (\Exception $e) {
                    \Log::error('Failed to send invoice email: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Server created successfully',
                'invoice' => [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'total' => $finalAmount,
                    'credits_used' => $creditsApplied,
                    'status' => $invoice->status,
                ],
                'attributes' => [
                    'id' => $server->id,
                    'identifier' => $server->uuidShort,
                    'name' => $server->name,
                ],
            ]);
        } catch (\Exception $e) {
            // Rollback credits if server creation fails
            if ($creditsApplied > 0) {
                $userCredit = UserCredit::where('user_id', $user->id)->first();
                if ($userCredit) {
                    $creditsCount = (int) ceil($creditsApplied / 0.10);
                    $userCredit->credits += $creditsCount;
                    $userCredit->save();

                    CreditTransaction::create([
                        'user_id' => $user->id,
                        'amount' => $creditsCount,
                        'dollar_value' => $creditsApplied,
                        'type' => 'admin_grant',
                        'description' => "Refund for failed server creation: {$validated['name']}",
                    ]);
                }
            }
            
            throw new DisplayException('Failed to create server: ' . $e->getMessage());
        }
    }
}

