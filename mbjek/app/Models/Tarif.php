<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    use HasFactory;

    protected $fillable = [
        'jenis_kendaraan',
        'tarif_per_km',
        'tarif_minimum',
<<<<<<< HEAD
        'biaya_tambahan'
=======
        'biaya_tambahan',
        'promo',
>>>>>>> 5062047835e2f819e207cd96ca4d31c0f6864acf
    ];
}