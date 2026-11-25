<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Media extends Model
{
    protected $fillable = [
        'title',
        'type',
        'description',
        'cover',
    ];

    /**
     * Relasi Many-to-Many dengan User.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'media_user',
            'media_id',
            'user_id'
        )->withTimestamps();
    }
}
