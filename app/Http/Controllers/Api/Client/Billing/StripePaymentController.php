<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\PaymentMethod;
use Pterodactyl\Models\Invoice;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Exceptions\DisplayException;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Customer;
use Stripe\PaymentMethod as StripePaymentMethod;

class StripePaymentController extends ClientApiController
{
    public function __construct()
    {
        parent::__construct();
        Stripe::setApiKey(config('stripe.secret_key'));
    }

    /**
     * Create a payment intent for an invoice.
     */
    public function createPaymentIntent(Request $request, int $invoiceId): JsonResponse
    {
        $user = $request->user();
        $invoice = Invoice::where('user_id', $user->id)
            ->where('id', $invoiceId)
            ->firstOrFail();

        if ($invoice->status !== 'pending') {
            throw new DisplayException('This invoice cannot be paid.');
        }

        try {
            // Create or get Stripe customer
            $customer = Customer::create([
                'email' => $user->email,
                'name' => $user->name_first . ' ' . $user->name_last,
                'metadata' => [
                    'user_id' => $user->id,
                ],
            ]);

            // Create payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => (int) ($invoice->total * 100), // Convert to cents
                'currency' => config('stripe.currency'),
                'customer' => $customer->id,
                'metadata' => [
                    'invoice_id' => $invoice->id,
                    'user_id' => $user->id,
                ],
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'publicKey' => config('stripe.public_key'),
            ]);
        } catch (\Exception $e) {
            throw new DisplayException('Failed to create payment: ' . $e->getMessage());
        }
    }

    /**
     * Confirm payment and mark invoice as paid.
     */
    public function confirmPayment(Request $request, int $invoiceId): JsonResponse
    {
        $validated = $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        $user = $request->user();
        $invoice = Invoice::where('user_id', $user->id)
            ->where('id', $invoiceId)
            ->firstOrFail();

        try {
            // Verify payment intent
            $paymentIntent = PaymentIntent::retrieve($validated['payment_intent_id']);

            if ($paymentIntent->status === 'succeeded') {
                // Mark invoice as paid
                $invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

                // Save payment method for future use (optional)
                if ($paymentIntent->payment_method) {
                    $stripePaymentMethod = StripePaymentMethod::retrieve($paymentIntent->payment_method);
                    
                    PaymentMethod::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'provider_id' => $stripePaymentMethod->id,
                        ],
                        [
                            'type' => 'card',
                            'last_four' => $stripePaymentMethod->card->last4 ?? null,
                            'brand' => $stripePaymentMethod->card->brand ?? null,
                            'exp_month' => $stripePaymentMethod->card->exp_month ?? null,
                            'exp_year' => $stripePaymentMethod->card->exp_year ?? null,
                            'is_default' => true,
                        ]
                    );
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful! Invoice has been paid.',
                ]);
            }

            throw new DisplayException('Payment was not successful.');
        } catch (\Exception $e) {
            throw new DisplayException('Failed to confirm payment: ' . $e->getMessage());
        }
    }

    /**
     * Process card payment for server creation.
     */
    public function processServerPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method_id' => 'required|string',
        ]);

        $user = $request->user();

        try {
            // Create or get Stripe customer
            $customer = Customer::create([
                'email' => $user->email,
                'name' => $user->name_first . ' ' . $user->name_last,
                'payment_method' => $validated['payment_method_id'],
                'metadata' => [
                    'user_id' => $user->id,
                ],
            ]);

            // Attach payment method to customer
            StripePaymentMethod::retrieve($validated['payment_method_id'])->attach([
                'customer' => $customer->id,
            ]);

            // Create and confirm payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => (int) ($validated['amount'] * 100), // Convert to cents
                'currency' => config('stripe.currency'),
                'customer' => $customer->id,
                'payment_method' => $validated['payment_method_id'],
                'confirmation_method' => 'automatic',
                'confirm' => true,
                'metadata' => [
                    'user_id' => $user->id,
                    'type' => 'server_purchase',
                ],
            ]);

            if ($paymentIntent->status === 'succeeded') {
                // Save payment method
                $stripePaymentMethod = StripePaymentMethod::retrieve($validated['payment_method_id']);
                
                PaymentMethod::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'provider_id' => $stripePaymentMethod->id,
                    ],
                    [
                        'type' => 'card',
                        'last_four' => $stripePaymentMethod->card->last4 ?? null,
                        'brand' => $stripePaymentMethod->card->brand ?? null,
                        'exp_month' => $stripePaymentMethod->card->exp_month ?? null,
                        'exp_year' => $stripePaymentMethod->card->exp_year ?? null,
                        'is_default' => true,
                    ]
                );

                return response()->json([
                    'success' => true,
                    'payment_intent_id' => $paymentIntent->id,
                ]);
            }

            throw new DisplayException('Payment failed. Please try again.');
        } catch (\Exception $e) {
            throw new DisplayException('Payment failed: ' . $e->getMessage());
        }
    }
}

