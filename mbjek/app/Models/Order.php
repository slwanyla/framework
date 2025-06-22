<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // ✅ TAMBAHKAN INI
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;



class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'driver_id',
        'tipe_kendaraan',
        'lokasi_jemput',
        'lokasi_tujuan',
        'jemput_latitude',
        'jemput_longitude',
        'tujuan_latitude',
        'tujuan_longitude',
        'jarak',
        'tarif',
        'status',
        'waktu_pesan',
        'waktu_selesai',
        'bukti_transaksi',
        'alasan_batal',
        'dibatalkan_oleh',
        'canceled_at'
    ];
    

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }  

    public function driverCandidates() {
        return $this->hasMany(OrderDriverCandidate::class, 'order_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
    
}
