<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Store;

use Pterodactyl\Models\Egg;
use Pterodactyl\Models\Nest;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Http\Controllers\Controller;

class EggController extends Controller
{
    /**
     * Get all available eggs/games for the store.
     */
    public function index(): JsonResponse
    {
        $nests = Nest::with('eggs')->get();

        $eggs = [];
        foreach ($nests as $nest) {
            foreach ($nest->eggs as $egg) {
                $eggs[] = [
                    'id' => $egg->id,
                    'uuid' => $egg->uuid,
                    'name' => $egg->name,
                    'description' => $egg->description,
                    'nest_id' => $egg->nest_id,
                    'nest_name' => $nest->name,
                    'docker_images' => $egg->docker_images,
                ];
            }
        }

        return response()->json([
            'data' => $eggs,
        ]);
    }
}

