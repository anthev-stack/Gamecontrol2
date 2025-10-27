<?php

namespace Pterodactyl\Http\Controllers\Admin\Credits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Models\User;
use Pterodactyl\Models\UserCredit;
use Pterodactyl\Models\CreditTransaction;

class CreditController extends Controller
{
    /**
     * Display the credit management page.
     */
    public function index(): View
    {
        return view('admin.credits.index');
    }

    /**
     * Get user credit information.
     */
    public function show(Request $request, int $userId): JsonResponse
    {
        $user = User::findOrFail($userId);
        $userCredit = UserCredit::firstOrCreate(
            ['user_id' => $userId],
            ['credits' => 0]
        );

        $transactions = CreditTransaction::where('user_id', $userId)
            ->with('admin')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'dollar_value' => $transaction->dollar_value,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at->toIso8601String(),
                    'admin' => $transaction->admin ? [
                        'id' => $transaction->admin->id,
                        'username' => $transaction->admin->username,
                    ] : null,
                ];
            });

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
            ],
            'credits' => $userCredit->credits,
            'dollar_value' => $userCredit->credits * 0.10,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Add credits to a user.
     */
    public function store(Request $request, int $userId): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1',
            'type' => 'required|string|in:admin_grant,giveaway,referral,payment',
            'description' => 'nullable|string|max:500',
        ]);

        $user = User::findOrFail($userId);
        $userCredit = UserCredit::firstOrCreate(
            ['user_id' => $userId],
            ['credits' => 0]
        );

        // Add credits
        $userCredit->credits += $validated['amount'];
        $userCredit->save();

        // Record transaction
        CreditTransaction::create([
            'user_id' => $userId,
            'amount' => $validated['amount'],
            'dollar_value' => $validated['amount'] * 0.10,
            'type' => $validated['type'],
            'description' => $validated['description'] ?? "Admin granted {$validated['amount']} credits",
            'admin_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => "Successfully added {$validated['amount']} credits to {$user->username}",
            'credits' => $userCredit->credits,
        ]);
    }

    /**
     * Remove credits from a user.
     */
    public function destroy(Request $request, int $userId): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1',
            'description' => 'nullable|string|max:500',
        ]);

        $user = User::findOrFail($userId);
        $userCredit = UserCredit::firstOrCreate(
            ['user_id' => $userId],
            ['credits' => 0]
        );

        if ($userCredit->credits < $validated['amount']) {
            return response()->json([
                'message' => 'User does not have enough credits',
            ], 400);
        }

        // Remove credits
        $userCredit->credits -= $validated['amount'];
        $userCredit->save();

        // Record transaction
        CreditTransaction::create([
            'user_id' => $userId,
            'amount' => -$validated['amount'],
            'dollar_value' => -($validated['amount'] * 0.10),
            'type' => 'admin_removal',
            'description' => $validated['description'] ?? "Admin removed {$validated['amount']} credits",
            'admin_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => "Successfully removed {$validated['amount']} credits from {$user->username}",
            'credits' => $userCredit->credits,
        ]);
    }
}

