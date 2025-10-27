<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentMethod extends Model
{
    protected $table = 'payment_methods';

    protected $fillable = [
        'user_id',
        'type',
        'provider_id',
        'last_four',
        'brand',
        'exp_month',
        'exp_year',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get display name for the payment method
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->type === 'card') {
            return ucfirst($this->brand) . ' ending in ' . $this->last_four;
        }

        return ucfirst($this->type);
    }
}

