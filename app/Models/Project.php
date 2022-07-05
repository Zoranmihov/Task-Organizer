<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $fillable = [
        'title',
        'description',
        'members',
        'created_by',
        'tasks',
    ];

    protected $casts = [
        "members" => 'array',
        'tasks' => 'array'
    ];

    protected $hidden = [
        'updated_at',
    ];
}
