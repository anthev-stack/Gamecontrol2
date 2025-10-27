<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCredit extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'user_credits';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'credits',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'credits' => 'integer',
    ];

    /**
     * Get the user that owns the credits.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the dollar value of the credits.
     *
     * @return float
     */
    public function getDollarValueAttribute(): float
    {
        return $this->credits * 0.10;
    }

    /**
     * Add credits to the user's account.
     *
     * @param int $amount
     * @param string $type
     * @param string|null $description
     * @param int|null $adminId
     * @return bool
     */
    public function addCredits(int $amount, string $type = 'admin_grant', ?string $description = null, ?int $adminId = null): bool
    {
        $this->increment('credits', $amount);
        
        CreditTransaction::create([
            'user_id' => $this->user_id,
            'amount' => $amount,
            'type' => $type,
            'description' => $description,
            'admin_id' => $adminId,
        ]);

        return true;
    }

    /**
     * Deduct credits from the user's account.
     *
     * @param int $amount
     * @param string $type
     * @param string|null $description
     * @return bool
     */
    public function deductCredits(int $amount, string $type = 'purchase', ?string $description = null): bool
    {
        if ($this->credits < $amount) {
            return false;
        }

        $this->decrement('credits', $amount);
        
        CreditTransaction::create([
            'user_id' => $this->user_id,
            'amount' => -$amount,
            'type' => $type,
            'description' => $description,
        ]);

        return true;
    }
}

