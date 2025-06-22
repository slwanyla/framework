<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // ✅ TAMBAHKAN INI
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Driver extends Model
{
    use HasApiTokens, HasFactory; // ✅ Sekarang bisa dipake

    protected $fillable = [
        'user_id',
        'tipe_kendaraan',
        'merek',
        'warna_kendaraan',
        'no_plat',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


}