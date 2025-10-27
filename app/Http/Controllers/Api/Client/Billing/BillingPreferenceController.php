<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\UserBillingPreference;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;

class BillingPreferenceController extends ClientApiController
{
    /**
     * Get the current user's billing preferences.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $preferences = UserBillingPreference::firstOrCreate(
            ['user_id' => $user->id],
            [
                'auto_use_credits' => true,
                'email_invoices' => true,
                'email_payment_reminders' => true,
            ]
        );

        return response()->json($preferences);
    }

    /**
     * Update the user's billing preferences.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'auto_use_credits' => 'sometimes|boolean',
            'email_invoices' => 'sometimes|boolean',
            'email_payment_reminders' => 'sometimes|boolean',
        ]);

        $user = $request->user();
        
        $preferences = UserBillingPreference::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Billing preferences updated successfully',
            'data' => $preferences,
        ]);
    }
}

