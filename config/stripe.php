<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Stripe API Keys
    |--------------------------------------------------------------------------
    |
    | Your Stripe API keys for processing payments. These are TEST keys for
    | sandbox/development. Replace with live keys in production.
    |
    */

    'public_key' => env('STRIPE_PUBLIC_KEY', ''),
    
    'secret_key' => env('STRIPE_SECRET_KEY', ''),
    
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET', ''),
    
    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    |
    | The currency to use for all Stripe transactions.
    |
    */

    'currency' => 'usd',
];

