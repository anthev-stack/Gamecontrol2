<?php

namespace Pterodactyl\Http\Controllers\Api\Admin\Credits;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\User;
use Pterodactyl\Models\UserCredit;
use Pterodactyl\Http\Controllers\Api\Application\ApplicationApiController;
use Illuminate\Validation\ValidationException;

class UserCreditController extends ApplicationApiController
{
    /**
     * Add credits to a user's account.
     *
     * @throws ValidationException
     */
    public function store(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1|max:100000',
            'type' => 'required|string|in:admin_grant,giveaway,referral,payment',
            'description' => 'nullable|string|max:500',
        ]);

        // Get or create credits account
        $credits = UserCredit::firstOrCreate(
            ['user_id' => $user->id],
            ['amount' => 0]
        );

        // Add credits
        $credits->addCredits(
            $validated['amount'],
            $validated['type'],
            $validated['description'] ?? null,
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => "Added {$validated['amount']} credits (\${$credits->fresh()->dollar_value}) to {$user->username}",
            'new_balance' => $credits->fresh()->amount,
            'dollar_value' => $credits->fresh()->dollar_value,
        ]);
    }

    /**
     * Deduct credits from a user's account.
     *
     * @throws ValidationException
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1|max:100000',
            'description' => 'nullable|string|max:500',
        ]);

        // Get credits account
        $credits = UserCredit::where('user_id', $user->id)->first();

        if (!$credits || $credits->amount < $validated['amount']) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient credits',
            ], 400);
        }

        // Deduct credits
        $credits->deductCredits(
            $validated['amount'],
            'admin_deduct',
            $validated['description'] ?? "Admin deduction by " . $request->user()->username
        );

        return response()->json([
            'success' => true,
            'message' => "Deducted {$validated['amount']} credits from {$user->username}",
            'new_balance' => $credits->fresh()->amount,
            'dollar_value' => $credits->fresh()->dollar_value,
        ]);
    }

    /**
     * Get a user's credit balance and transaction history.
     */
    public function show(User $user): JsonResponse
    {
        $credits = UserCredit::firstOrCreate(
            ['user_id' => $user->id],
            ['amount' => 0]
        );

        $transactions = $user->creditTransactions()
            ->with('admin:id,username')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
            ],
            'credits' => $credits->amount,
            'dollar_value' => $credits->dollar_value,
            'transactions' => $transactions,
        ]);
    }
}

