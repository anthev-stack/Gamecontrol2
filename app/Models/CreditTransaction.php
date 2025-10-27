<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditTransaction extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'credit_transactions';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'amount',
        'dollar_value',
        'type',
        'description',
        'admin_id',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'amount' => 'integer',
        'dollar_value' => 'float',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who created the transaction.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}

