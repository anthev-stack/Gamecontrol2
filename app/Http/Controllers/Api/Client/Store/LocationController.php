<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Store;

use Pterodactyl\Models\Node;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\Location;
use Pterodactyl\Http\Controllers\Controller;

class LocationController extends Controller
{
    /**
     * Get all available locations with node capacity information.
     */
    public function index(): JsonResponse
    {
        $locations = Location::with(['nodes' => function ($query) {
            $query->where('public', true)
                  ->where('maintenance_mode', false);
        }, 'nodes.servers'])->get();

        $locationsData = $locations->map(function ($location) {
            $nodes = $location->nodes;
            
            if ($nodes->isEmpty()) {
                return [
                    'id' => $location->id,
                    'short' => $location->short,
                    'long' => $location->long ?? $location->short,
                    'available' => false,
                    'reason' => 'No nodes available',
                    'capacity' => [
                        'memory' => 0,
                        'disk' => 0,
                    ],
                ];
            }

            // Calculate total and used resources across all nodes
            $totalMemory = 0;
            $usedMemory = 0;
            $totalDisk = 0;
            $usedDisk = 0;

            foreach ($nodes as $node) {
                $totalMemory += $node->memory;
                $totalDisk += $node->disk;

                // Sum up used resources from servers on this node
                foreach ($node->servers as $server) {
                    $usedMemory += $server->memory;
                    $usedDisk += $server->disk;
                }
            }

            // Calculate available resources
            $availableMemory = $totalMemory - $usedMemory;
            $availableDisk = $totalDisk - $usedDisk;

            // Check if location can accommodate minimum server requirements (1GB RAM, 5GB disk)
            $canAccommodate = $availableMemory >= 1024 && $availableDisk >= 5120;

            return [
                'id' => $location->id,
                'short' => $location->short,
                'long' => $location->long ?? $location->short,
                'available' => $canAccommodate,
                'reason' => !$canAccommodate ? 'Insufficient resources' : null,
                'capacity' => [
                    'memory' => [
                        'total' => $totalMemory,
                        'used' => $usedMemory,
                        'available' => $availableMemory,
                        'percentage' => $totalMemory > 0 ? round(($usedMemory / $totalMemory) * 100, 2) : 0,
                    ],
                    'disk' => [
                        'total' => $totalDisk,
                        'used' => $usedDisk,
                        'available' => $availableDisk,
                        'percentage' => $totalDisk > 0 ? round(($usedDisk / $totalDisk) * 100, 2) : 0,
                    ],
                ],
                'node_count' => $nodes->count(),
            ];
        });

        return response()->json([
            'data' => $locationsData,
        ]);
    }

    /**
     * Check if a specific configuration can be accommodated at a location.
     */
    public function checkAvailability(int $locationId): JsonResponse
    {
        $ram = request()->input('ram', 2); // GB
        $storage = request()->input('storage', 5); // GB

        $location = Location::with(['nodes' => function ($query) {
            $query->where('public', true)
                  ->where('maintenance_mode', false);
        }, 'nodes.servers'])->findOrFail($locationId);

        if ($location->nodes->isEmpty()) {
            return response()->json([
                'available' => false,
                'reason' => 'No nodes available at this location',
            ]);
        }

        // Convert to MB for comparison
        $requiredMemory = $ram * 1024;
        $requiredDisk = $storage * 1024;

        foreach ($location->nodes as $node) {
            $usedMemory = $node->servers->sum('memory');
            $usedDisk = $node->servers->sum('disk');

            $availableMemory = $node->memory - $usedMemory;
            $availableDisk = $node->disk - $usedDisk;

            if ($availableMemory >= $requiredMemory && $availableDisk >= $requiredDisk) {
                return response()->json([
                    'available' => true,
                    'node_id' => $node->id,
                    'node_name' => $node->name,
                ]);
            }
        }

        return response()->json([
            'available' => false,
            'reason' => 'Insufficient resources. All nodes at this location are full.',
        ]);
    }
}

