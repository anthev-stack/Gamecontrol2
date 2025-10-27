<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ServerSplit extends Model
{
    protected $table = 'server_splits';

    protected $fillable = [
        'server_id',
        'user_id',
        'invited_by',
        'split_percentage',
        'status',
        'invitation_token',
        'accepted_at',
    ];

    protected $casts = [
        'split_percentage' => 'float',
        'accepted_at' => 'datetime',
    ];

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Generate a unique invitation token
     */
    public static function generateToken(): string
    {
        do {
            $token = Str::random(32);
        } while (self::where('invitation_token', $token)->exists());

        return $token;
    }

    /**
     * Accept the invitation
     */
    public function accept(): void
    {
        $this->update([
            'status' => 'active',
            'accepted_at' => now(),
        ]);
    }

    /**
     * Decline the invitation
     */
    public function decline(): void
    {
        $this->update(['status' => 'declined']);
    }
}

