<?php

use Illuminate\Support\Facades\Route;
use Pterodactyl\Http\Controllers\Api\Client;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
|
| These routes are accessible without authentication for public features
| like the store/cart system.
|
*/

Route::prefix('/store')->group(function () {
    Route::get('/locations', [Client\Store\LocationController::class, 'index'])->name('api:public.store.locations');
    Route::post('/locations/{location}/check', [Client\Store\LocationController::class, 'checkAvailability'])->name('api:public.store.locations.check');
    Route::get('/eggs', [Client\Store\EggController::class, 'index'])->name('api:public.store.eggs');
});

