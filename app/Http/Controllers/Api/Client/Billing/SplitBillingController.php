<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\ServerSplit;
use Pterodactyl\Models\User;
use Pterodactyl\Models\Subuser;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Exceptions\DisplayException;
use Illuminate\Support\Facades\Mail;
use Pterodactyl\Mail\SplitBillingInvitation;

class SplitBillingController extends ClientApiController
{
    /**
     * Get all split billing invitations for the user (sent and received).
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Splits where user is a participant
        $participatingSplits = ServerSplit::where('user_id', $user->id)
            ->with(['server', 'inviter'])
            ->get()
            ->map(function ($split) {
                return [
                    'id' => $split->id,
                    'server' => [
                        'id' => $split->server->id,
                        'name' => $split->server->name,
                        'uuid' => $split->server->uuidShort,
                    ],
                    'inviter' => [
                        'username' => $split->inviter->username,
                        'email' => $split->inviter->email,
                    ],
                    'split_percentage' => $split->split_percentage,
                    'status' => $split->status,
                    'created_at' => $split->created_at->toIso8601String(),
                ];
            });

        // Splits where user invited others
        $sentInvitations = ServerSplit::where('invited_by', $user->id)
            ->with(['server', 'user'])
            ->get()
            ->map(function ($split) {
                return [
                    'id' => $split->id,
                    'server' => [
                        'id' => $split->server->id,
                        'name' => $split->server->name,
                        'uuid' => $split->server->uuidShort,
                    ],
                    'participant' => [
                        'username' => $split->user->username,
                        'email' => $split->user->email,
                    ],
                    'split_percentage' => $split->split_percentage,
                    'status' => $split->status,
                    'created_at' => $split->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'participating' => $participatingSplits,
            'sent' => $sentInvitations,
        ]);
    }

    /**
     * Create a new split billing invitation.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'server_id' => 'required|integer|exists:servers,id',
            'email' => 'required|email',
            'split_percentage' => 'required|numeric|min:1|max:99',
        ]);

        $user = $request->user();
        $server = Server::findOrFail($validated['server_id']);

        // Check if user owns the server
        if ($server->owner_id !== $user->id) {
            throw new DisplayException('You can only invite others to split servers you own.');
        }

        // Find or create the invited user
        $invitedUser = User::where('email', $validated['email'])->first();
        
        if (!$invitedUser) {
            throw new DisplayException('No user found with that email address. They must have an account first.');
        }

        if ($invitedUser->id === $user->id) {
            throw new DisplayException('You cannot invite yourself.');
        }

        // Check if split already exists
        $existing = ServerSplit::where('server_id', $server->id)
            ->where('user_id', $invitedUser->id)
            ->whereIn('status', ['pending', 'active'])
            ->first();

        if ($existing) {
            throw new DisplayException('This user already has a split invitation for this server.');
        }

        // Create the split invitation
        $split = ServerSplit::create([
            'server_id' => $server->id,
            'user_id' => $invitedUser->id,
            'invited_by' => $user->id,
            'split_percentage' => $validated['split_percentage'],
            'status' => 'pending',
            'invitation_token' => ServerSplit::generateToken(),
        ]);

        // TODO: Send email notification (when SMTP is configured)
        // Mail::to($invitedUser)->send(new SplitBillingInvitation($split));

        return response()->json([
            'success' => true,
            'message' => 'Split billing invitation sent successfully',
            'data' => $split,
        ]);
    }

    /**
     * Accept a split billing invitation.
     */
    public function accept(Request $request, int $splitId): JsonResponse
    {
        $user = $request->user();
        $split = ServerSplit::findOrFail($splitId);

        if ($split->user_id !== $user->id) {
            throw new DisplayException('This invitation is not for you.');
        }

        if ($split->status !== 'pending') {
            throw new DisplayException('This invitation has already been processed.');
        }

        $split->accept();

        // Grant server access as subuser
        Subuser::create([
            'user_id' => $user->id,
            'server_id' => $split->server_id,
            'permissions' => ['control.console', 'control.start', 'control.stop', 'control.restart'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Split billing invitation accepted. You now have access to the server.',
        ]);
    }

    /**
     * Decline a split billing invitation.
     */
    public function decline(Request $request, int $splitId): JsonResponse
    {
        $user = $request->user();
        $split = ServerSplit::findOrFail($splitId);

        if ($split->user_id !== $user->id) {
            throw new DisplayException('This invitation is not for you.');
        }

        if ($split->status !== 'pending') {
            throw new DisplayException('This invitation has already been processed.');
        }

        $split->decline();

        return response()->json([
            'success' => true,
            'message' => 'Split billing invitation declined.',
        ]);
    }

    /**
     * Remove a split billing participant.
     */
    public function destroy(Request $request, int $splitId): JsonResponse
    {
        $user = $request->user();
        $split = ServerSplit::findOrFail($splitId);
        $server = $split->server;

        // Only the server owner can remove splits
        if ($server->owner_id !== $user->id) {
            throw new DisplayException('Only the server owner can remove split billing participants.');
        }

        $split->update(['status' => 'removed']);

        // Remove server access
        Subuser::where('user_id', $split->user_id)
            ->where('server_id', $server->id)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Split billing participant removed successfully.',
        ]);
    }
}

