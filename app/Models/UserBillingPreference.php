<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserBillingPreference extends Model
{
    protected $table = 'user_billing_preferences';

    protected $fillable = [
        'user_id',
        'auto_use_credits',
        'email_invoices',
        'email_payment_reminders',
    ];

    protected $casts = [
        'auto_use_credits' => 'boolean',
        'email_invoices' => 'boolean',
        'email_payment_reminders' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

