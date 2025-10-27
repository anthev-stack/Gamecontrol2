<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\Server;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Services\Servers\ServerDeletionService;

class ServerCancellationController extends ClientApiController
{
    private ServerDeletionService $deletionService;

    public function __construct(ServerDeletionService $deletionService)
    {
        parent::__construct();
        $this->deletionService = $deletionService;
    }

    /**
     * Cancel/delete a server.
     */
    public function destroy(Request $request, int $serverId): JsonResponse
    {
        $user = $request->user();
        $server = Server::where('id', $serverId)
            ->where('owner_id', $user->id)
            ->firstOrFail();

        try {
            $this->deletionService->handle($server);

            return response()->json([
                'success' => true,
                'message' => 'Server cancelled and deleted successfully. You will not be billed for this server going forward.',
            ]);
        } catch (\Exception $e) {
            throw new DisplayException('Failed to cancel server: ' . $e->getMessage());
        }
    }
}

