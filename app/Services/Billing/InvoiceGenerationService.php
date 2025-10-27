<?php

namespace Pterodactyl\Services\Billing;

use Pterodactyl\Models\Invoice;
use Pterodactyl\Models\InvoiceItem;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\User;
use Pterodactyl\Models\UserCredit;
use Pterodactyl\Models\UserBillingPreference;
use Pterodactyl\Models\CreditTransaction;
use Pterodactyl\Models\ServerSplit;
use Pterodactyl\Mail\InvoiceGenerated;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class InvoiceGenerationService
{
    /**
     * Generate a monthly invoice for a server.
     */
    public function generateServerInvoice(Server $server): Invoice
    {
        $owner = $server->user;
        $monthlyPrice = $this->calculateServerPrice($server);

        // Check for active splits
        $splits = ServerSplit::where('server_id', $server->id)
            ->where('status', 'active')
            ->get();

        // Calculate owner's share
        $ownerShare = 100;
        foreach ($splits as $split) {
            $ownerShare -= $split->split_percentage;
        }

        $ownerAmount = $monthlyPrice * ($ownerShare / 100);

        // Create invoice for owner
        $ownerInvoice = $this->createInvoice(
            $owner,
            $server,
            $ownerAmount,
            "Monthly hosting for {$server->name} ({$ownerShare}% share)"
        );

        // Create invoices for split participants
        foreach ($splits as $split) {
            $participantAmount = $monthlyPrice * ($split->split_percentage / 100);
            $this->createInvoice(
                $split->user,
                $server,
                $participantAmount,
                "Monthly hosting for {$server->name} ({$split->split_percentage}% share)"
            );
        }

        return $ownerInvoice;
    }

    /**
     * Create an invoice for a user.
     */
    private function createInvoice(User $user, ?Server $server, float $amount, string $description): Invoice
    {
        $subtotal = $amount;
        $creditsApplied = 0;

        // Check if user wants to auto-use credits
        $preferences = UserBillingPreference::where('user_id', $user->id)->first();
        $autoUseCredits = $preferences ? $preferences->auto_use_credits : true;

        if ($autoUseCredits) {
            $userCredit = UserCredit::where('user_id', $user->id)->first();
            if ($userCredit && $userCredit->credits > 0) {
                $dollarValue = $userCredit->credits * 0.10;
                $creditsToUse = min($dollarValue, $amount);
                $creditsCount = (int) ceil($creditsToUse / 0.10);

                // Apply credits
                $userCredit->credits -= $creditsCount;
                $userCredit->save();

                CreditTransaction::create([
                    'user_id' => $user->id,
                    'amount' => -$creditsCount,
                    'dollar_value' => -$creditsToUse,
                    'type' => 'payment',
                    'description' => $description,
                ]);

                $creditsApplied = $creditsToUse;
            }
        }

        $finalAmount = $subtotal - $creditsApplied;

        // Create invoice
        $invoice = Invoice::create([
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'user_id' => $user->id,
            'server_id' => $server?->id,
            'subtotal' => $subtotal,
            'credits_used' => $creditsApplied,
            'total' => $finalAmount,
            'status' => $finalAmount <= 0 ? 'paid' : 'pending',
            'due_date' => Carbon::now()->addDays(7),
            'paid_at' => $finalAmount <= 0 ? now() : null,
            'description' => $description,
        ]);

        // Add invoice items
        InvoiceItem::create([
            'invoice_id' => $invoice->id,
            'description' => $description,
            'unit_price' => $amount,
            'quantity' => 1,
            'total' => $amount,
        ]);

        // Send email if user has email notifications enabled
        if ($preferences && $preferences->email_invoices) {
            try {
                Mail::to($user)->send(new InvoiceGenerated($invoice));
            } catch (\Exception $e) {
                \Log::error('Failed to send invoice email: ' . $e->getMessage());
            }
        }

        return $invoice;
    }

    /**
     * Calculate monthly price for a server.
     */
    private function calculateServerPrice(Server $server): float
    {
        // Simple pricing based on resources
        $ramGB = $server->memory / 1024;
        $diskGB = $server->disk / 1024;

        $ramPrice = $ramGB * 2; // $2 per GB RAM
        $diskPrice = $diskGB * 0.40; // $0.40 per GB disk

        return round($ramPrice + $diskPrice, 2);
    }
}

