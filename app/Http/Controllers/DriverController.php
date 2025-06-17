<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
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


}
