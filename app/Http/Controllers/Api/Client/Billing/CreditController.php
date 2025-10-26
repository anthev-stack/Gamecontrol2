<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\UserCredit;
use Pterodactyl\Models\CreditTransaction;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;

class CreditController extends ClientApiController
{
    /**
     * Get the current user's credit balance and recent transactions.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Get or create credits account
        $credits = UserCredit::firstOrCreate(
            ['user_id' => $user->id],
            ['amount' => 0]
        );

        // Get recent transactions
        $transactions = CreditTransaction::where('user_id', $user->id)
            ->with('admin:id,username,email')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'amount' => $transaction->amount,
                    'dollar_value' => $transaction->dollar_value,
                    'type' => $transaction->type,
                    'description' => $transaction->description,
                    'admin' => $transaction->admin ? [
                        'username' => $transaction->admin->username,
                        'email' => $transaction->admin->email,
                    ] : null,
                    'created_at' => $transaction->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'credits' => $credits->amount,
            'dollar_value' => $credits->dollar_value,
            'transactions' => $transactions,
        ]);
    }
}

