<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesPage extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'product_name',
        'description',
        'features',
        'audience',
        'price',
        'usp',
        'generated_content',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'features' => 'array',
            'generated_content' => 'array',
            'price' => 'decimal:2',
        ];
    }

    /**
     * Get the user that owns the sales page.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
