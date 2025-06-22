<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Driver;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DriverController extends Controller
{
    public function updateLocation(Request $request)
{
    $request->validate([
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
    ]);

    $user = $request->user(); // Ambil user dari token

// Cek apakah dia punya relasi driver
$driver = $user->driver;

if (!$driver) {
    return response()->json(['error' => 'User ini bukan driver'], 403);
}

// Simpan ke tabel driver atau langsung ke user jika pakai kolom latitude/longitude di tabel users
$user->update([
    'latitude' => $request->latitude,
    'longitude' => $request->longitude,
]);

\Log::info("📍 Lokasi berhasil disimpan untuk user ID {$user->id}");

return response()->json(['message' => 'Lokasi diperbarui'], 200);

}

public function updateStatus(Request $request)
{
    $request->validate([
        'status' => 'required|boolean',
    ]);

    $user = $request->user(); // user dari token
    $driver = $user->driver;
    

    if (!$driver) {
        return response()->json(['error' => 'User ini bukan driver'], 403);
    }

    $driver->status = $request->status;
    $driver->save();

    return response()->json(['message' => 'Status driver diperbarui'], 201);
}

    // Route: GET /api/order/{id}/driver
    public function getDriverByOrder($id)
{
    $order = Order::with('driver.user')->find($id);

    \Log::info('🔍 Order result:', ['order' => $order]);
    
    if (!$order) {
        \Log::warning('⚠️ Order belum punya driver_id');
        return response()->json(['message' => 'Order tidak ditemukan'], 404);
    }

    if (!$order->driver || !$order->driver->user) {
        return response()->json(['message' => 'Data driver tidak lengkap'], 404);
    }
    
    \Log::info('Driver Info', [
    'driver_id_dari_order' => $order->driver_id,
    'driver_user_id' => $order->driver->user->id ?? 'null',
    'driver_user_nama' => $order->driver->user->nama ?? 'null',
    'photo' => $order->driver->user->photo ?? 'null'
]);


    $driverUser = $order->driver->user;

    return response()->json([
        'id' => $driverUser->id,
        'nama' => $driverUser->nama,
        'foto' => $driverUser->photo 
            ? asset('storage/' . $driverUser->photo)
            : url('assets/img/default-driver.png'),
        'rating' => 4.8,
        'kendaraan_merk' => $order->driver->merek,
        'kendaraan_warna' => $order->driver->warna_kendaraan,
        'plat_nomor' => $order->driver->no_plat,
    ]);
}



}
