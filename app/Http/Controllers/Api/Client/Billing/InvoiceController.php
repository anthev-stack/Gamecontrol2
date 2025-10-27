<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\Invoice;
use Pterodactyl\Models\InvoiceItem;
use Pterodactyl\Models\UserCredit;
use Pterodactyl\Models\CreditTransaction;
use Pterodactyl\Models\UserBillingPreference;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;

class InvoiceController extends ClientApiController
{
    /**
     * Get all invoices for the current user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $invoices = Invoice::where('user_id', $user->id)
            ->with(['items', 'server'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'server' => $invoice->server ? [
                        'id' => $invoice->server->id,
                        'name' => $invoice->server->name,
                    ] : null,
                    'subtotal' => $invoice->subtotal,
                    'credits_used' => $invoice->credits_used,
                    'total' => $invoice->total,
                    'status' => $invoice->status,
                    'due_date' => $invoice->due_date->toIso8601String(),
                    'paid_at' => $invoice->paid_at?->toIso8601String(),
                    'description' => $invoice->description,
                    'items' => $invoice->items->map(function ($item) {
                        return [
                            'description' => $item->description,
                            'unit_price' => $item->unit_price,
                            'quantity' => $item->quantity,
                            'total' => $item->total,
                        ];
                    }),
                    'created_at' => $invoice->created_at->toIso8601String(),
                ];
            });

        return response()->json($invoices);
    }

    /**
     * Get a specific invoice.
     */
    public function show(Request $request, int $invoiceId): JsonResponse
    {
        $user = $request->user();
        $invoice = Invoice::where('user_id', $user->id)
            ->with(['items', 'server'])
            ->findOrFail($invoiceId);

        return response()->json([
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'server' => $invoice->server ? [
                'id' => $invoice->server->id,
                'name' => $invoice->server->name,
            ] : null,
            'subtotal' => $invoice->subtotal,
            'credits_used' => $invoice->credits_used,
            'total' => $invoice->total,
            'status' => $invoice->status,
            'due_date' => $invoice->due_date->toIso8601String(),
            'paid_at' => $invoice->paid_at?->toIso8601String(),
            'description' => $invoice->description,
            'items' => $invoice->items,
            'created_at' => $invoice->created_at->toIso8601String(),
        ]);
    }

    /**
     * Pay an invoice with credits.
     */
    public function payWithCredits(Request $request, int $invoiceId): JsonResponse
    {
        $user = $request->user();
        $invoice = Invoice::where('user_id', $user->id)->findOrFail($invoiceId);

        if ($invoice->status !== 'pending') {
            return response()->json(['message' => 'Invoice is not pending payment'], 400);
        }

        $userCredit = UserCredit::where('user_id', $user->id)->first();
        $creditsNeeded = (int) ceil($invoice->total * 10); // $1 = 10 credits

        if (!$userCredit || $userCredit->credits < $creditsNeeded) {
            return response()->json(['message' => 'Insufficient credits'], 400);
        }

        // Deduct credits
        $userCredit->credits -= $creditsNeeded;
        $userCredit->save();

        // Record transaction
        CreditTransaction::create([
            'user_id' => $user->id,
            'amount' => -$creditsNeeded,
            'dollar_value' => -$invoice->total,
            'type' => 'payment',
            'description' => "Payment for invoice {$invoice->invoice_number}",
        ]);

        // Mark invoice as paid
        $invoice->update([
            'status' => 'paid',
            'paid_at' => now(),
            'credits_used' => $invoice->total,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Invoice paid successfully with credits',
        ]);
    }
}

