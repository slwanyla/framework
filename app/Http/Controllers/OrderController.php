<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Models\User;
use App\Models\FcmToken;
use Midtrans\Snap;
use Midtrans\Config;


class OrderController extends Controller
{
    // ✅ Hitung tarif berdasarkan jarak
    private function hitungTarif($jarak)
    {
        $tarifDasar = 5000;
        $tarifPerKm = 2000;
        $biayaAdmin = 4000;

        if ($jarak <= 1) {
        $tarif = $tarifDasar;
    } else {
        $tarif = $tarifDasar + (($jarak - 1) * $tarifPerKm);
    }

    $pajak = round(($tarif + $biayaAdmin) * 0.1);
    $total = $tarif + $biayaAdmin + $pajak;

      return [
        'tarif' => round($tarif),
        'biaya_admin' => $biayaAdmin,
        'pajak' => $pajak,
        'total' => $total
    ];

    }

    // ✅ Hitung jarak manual (haversine)
    private function hitungJarak($lat1, $lng1, $lat2, $lng2)
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat/2)**2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng/2)**2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }

    // ✅ Hitung jarak via OpenRouteService
    public function hitungJarakORS($jemputLat, $jemputLng, $tujuanLat, $tujuanLng)
    {
        $response = Http::withHeaders([
            'Authorization' => config('services.ors.key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.openrouteservice.org/v2/directions/driving-car', [
            'coordinates' => [
                [$jemputLng, $jemputLat],
                [$tujuanLng, $tujuanLat],
            ],
        ]);

        if ($response->failed()) {
            throw new \Exception('Gagal ambil jarak dari OpenRouteService');
        }

        $data = $response->json();
        return $data['routes'][0]['summary']['distance'] / 1000; // dalam kilometer
    }

    // ✅ Cek tarif + driver terdekat
    public function cekTarif(Request $request)
{
    $request->validate([
        'jemput_latitude' => 'required|numeric',
        'jemput_longitude' => 'required|numeric',
        'tujuan_latitude' => 'required|numeric',
        'tujuan_longitude' => 'required|numeric',
    ]);

    $jemputLat = $request->jemput_latitude;
    $jemputLng = $request->jemput_longitude;
    $tujuanLat = $request->tujuan_latitude;
    $tujuanLng = $request->tujuan_longitude;

    try {
        $jarak = $this->hitungJarakORS($jemputLat, $jemputLng, $tujuanLat, $tujuanLng);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Gagal menghitung jarak: ' . $e->getMessage()], 500);
    }

    $tarifData = $this->hitungTarif($jarak);

    return response()->json([
        'jarak_km' => round($jarak, 2),
        'estimasi_tarif' => $tarifData['tarif'],
        'biaya_admin' => $tarifData['biaya_admin'],
        'pajak' => $tarifData['pajak'],
        'total_harga' => $tarifData['total'],
        'driver_terdekat' => []
    ]);
}

public function buatOrder(Request $request)
{
    \Log::info('🧾 Request buat order:', $request->all());
    $request->validate([
        'jemput_latitude' => 'required|numeric',
        'jemput_longitude' => 'required|numeric',
        'tujuan_latitude' => 'required|numeric',
        'tujuan_longitude' => 'required|numeric',
        'lokasi_jemput' => 'required|string',
        'lokasi_tujuan' => 'required|string',
        'tipe_kendaraan' => 'required|string',
       
    ]);
    $user = auth()->user();
    Log::info('🧾 Data yang akan disimpan:', $request->all());


    $order = Order::create([
        'customer_id' => auth()->id(),
        'jemput_latitude' => $request->jemput_latitude,
        'jemput_longitude' => $request->jemput_longitude,
        'tujuan_latitude' => $request->tujuan_latitude,
        'tujuan_longitude' => $request->tujuan_longitude,
        'lokasi_jemput' => $request->lokasi_jemput,
        'lokasi_tujuan' => $request->lokasi_tujuan,
        'tipe_kendaraan' => $request->tipe_kendaraan,
        'status' => 'menunggu', // default status
    ]);

    $drivers = User::where('role', 'driver')
    ->whereHas('driver', function ($q) use ($request) {
        $q->where('tipe_kendaraan', $request->tipe_kendaraan);
    })
    ->with('driver') // biar nanti bisa akses $driver->driver->tipe_kendaraan
    ->whereNotNull('latitude')
    ->whereNotNull('longitude')
    ->get()
    ->map(function ($driver) use ($request) {
        $jarak = $this->hitungJarak(
            $request->jemput_latitude,
            $request->jemput_longitude,
            $driver->latitude,
            $driver->longitude
        );
        $driver->jarak = $jarak;
        return $driver;
    })
    ->sortBy('jarak')
    ->values();

    $driverTerdekat = $drivers->first();

    if ($driverTerdekat) {
        // ✅ Simpan driver_id ke order
        $order->driver_id = $driverTerdekat->driver->id;
        $order->save();
        $tokens = FcmToken::where('user_id', $driverTerdekat->id)->pluck('token');

        if ($tokens->isNotEmpty()) {
            foreach ($tokens as $token) {
                // kirim notifikasi seperti di atas
            }
        }
    
        foreach ($tokens as $token) {
            Http::withHeaders([
                'Authorization' => 'key=' . env('FCM_SERVER_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://fcm.googleapis.com/fcm/send', [
                'to' => $token,
                'notification' => [
                    'title' => 'Order Baru Masuk!',
                    'body' => 'Ada orderan dari pelanggan dekat lokasi Anda.',
                ],
                'data' => [
                    'order_id' => $order->id,
                    'type' => 'order_baru'
                ],
            ]);
        }
    
    // ✅ Di luar blok if → agar response tetap dikirim meskipun driver tidak ditemukan
    return response()->json([
        'message' => 'Order berhasil dibuat',
        'order' => $order,
        'assigned_driver' => $driverTerdekat ? $driverTerdekat->id : null,
    ], 201);
} 
}

public function terimaOrder(Request $request)
{
    $request->validate([
        'order_id' => 'required|exists:orders,id',
        'driver_id' => 'required|exists:users,id',
    ]);

    $order = Order::find($request->order_id);

    $order->driver_id = $request->driver_id;
    $order->status = 'dijemput';
    $order->save();

    return response()->json(['message' => 'Berhasil mengambil order', 'order' => $order]);
}

    //untuk customer saat aplikasi menunggu driver datang, polling terus order statusnya.
    public function cekStatus($orderId)
    {
    \Log::info('📥 Permintaan cek status diterima untuk Order ID:', ['order_id' => $orderId]);

    $order = Order::find($orderId);

    if (!$order) {
        \Log::warning('⚠️ Order tidak ditemukan:', ['order_id' => $orderId]);
        return response()->json(['message' => 'Order tidak ditemukan.'], 404);
    }

    \Log::info('✅ Status order ditemukan:', [
        'status' => $order->status,
        'driver_id' => $order->driver_id,
        'dibatalkan_oleh' => $order->dibatalkan_oleh,
        'alasan_batal' => $order->alasan_batal
    ]);

    return response()->json([
        'status' => $order->status,
        'driver_id' => $order->driver_id,
        'dibatalkan_oleh' => $order->dibatalkan_oleh,
        'alasan_batal' => $order->alasan_batal
    ]);
}


public function batalkanOrder(Request $request)
{
    $request->validate([
        'order_id' => 'required|exists:orders,id',
        'dibatalkan_oleh' => 'required|in:customer,driver',
        'alasan_batal' => 'nullable|string'
    ]);

    $order = Order::findOrFail($request->order_id);

    if ($order->status === 'selesai') {
        return response()->json(['message' => 'Order sudah selesai, tidak bisa dibatalkan.'], 400);
    }

    $order->status = 'dibatalkan';
    $order->dibatalkan_oleh = $request->dibatalkan_oleh;
    $order->alasan_batal = $request->alasan_batal;
    $order->canceled_at = now();
    $order->save();

    return response()->json(['message' => 'Order berhasil dibatalkan.']);
}

// untuk driveraplikasi polling tiap 5 detik untuk cek apakah ada order baru yang harus direspons.
public function getOrderTerbaru(Request $request)
{
    $driverId = $request->query('driver_id');

    \Log::info('🔍 Cek order terbaru untuk driver ID: ' . $driverId);

    $order = Order::where('driver_id', $driverId)
                  ->where('status', 'menunggu')
                  ->latest()
                  ->first();

    if ($order) {
        return response()->json(['order' => $order]);
    } else {
        return response()->json(['order' => null]);
    }
}

}    