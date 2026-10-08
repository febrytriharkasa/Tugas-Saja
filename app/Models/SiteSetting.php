<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['key', 'value', 'type', 'group_name', 'updated_at'];

    protected $casts = [
        'updated_at' => 'datetime',
    ];

    public static function getVal(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }
}
