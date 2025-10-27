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
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Services\Servers\ServerCreationService;
use Pterodactyl\Exceptions\DisplayException;

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
            'memory' => 'required|integer|min:512',
            'disk' => 'required|integer|min:1024',
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

        // Calculate monthly price (simplified - should match cart logic)
        $pricePerGB = 2; // $2/GB RAM
        $storagePerGB = 0.40; // $0.40/GB storage
        $monthlyPrice = ($validated['memory'] / 1024 * $pricePerGB) + ($validated['disk'] / 1024 * $storagePerGB);

        // For now, we'll skip payment processing and just create the server
        // In production, you'd handle Stripe payment or credit deduction here

        // Create the server
        try {
            $server = $this->creationService->handle([
                'name' => $validated['name'],
                'owner_id' => $user->id,
                'egg_id' => $egg->id,
                'node_id' => $node->id,
                'allocation_id' => null, // Will be auto-assigned
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

            return response()->json([
                'success' => true,
                'message' => 'Server created successfully',
                'attributes' => [
                    'id' => $server->id,
                    'identifier' => $server->uuidShort,
                    'name' => $server->name,
                ],
            ]);
        } catch (\Exception $e) {
            throw new DisplayException('Failed to create server: ' . $e->getMessage());
        }
    }
}

