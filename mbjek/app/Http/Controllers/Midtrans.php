<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Snap;
use Midtrans\Config;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class Midtrans extends Controller

{
    public function getSnapToken(Request $request)
    {
        \Log::info('🧪 Memanggil Midtrans Token API...'); 
        Log::info('🔑 Snap Token Request Masuk', $request->all());

        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $orderId = $request->input('order_id');

        if (!$order) {
            return response()->json(['error' => 'Order tidak ditemukan'], 404);
        }

        // Konfigurasi Midtrans
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $snapPayload = [
            'transaction_details' => [
                'order_id' => 'MBJEK-' . $order->id,
                'gross_amount' => (int) $request->input('total_harga'),
            ],
            'customer_details' => [
                'first_name' => optional($order->customer)->nama ?? 'Customer',
                'email' => optional($order->customer)->email ?? 'customer@mbjek.com',
            ],
            'enabled_payments' => ['qris']
        ];

        try {
            $snapToken = Snap::getSnapToken($snapPayload);

            // Simpan token di order (opsional)
            $order->snap_token = $snapToken;
            $order->save();

            return response()->json(['token' => $snapToken]);

        } catch (\Exception $e) {
            Log::error('❌ Gagal ambil Snap Token: ' . $e->getMessage());
            return response()->json(['error' => 'Midtrans Error', 'message' => $e->getMessage()], 500);
        }
    }

    // MidtransController.php
    public function handleNotification(Request $request)
{
    $notif = $request->all();

    $orderId = str_replace('order_', '', $notif['order_id']); // Ambil ID aslinya

    if ($notif['transaction_status'] === 'settlement') {
        // ✅ Tandai sebagai sudah dibayar
        \App\Models\Payment::updateOrCreate(
            ['order_id' => $orderId],
            [
                'status' => 'sudah_bayar',
                'jumlah' => $notif['gross_amount'],
                'bukti_bayar' => null // bisa kamu isi pakai snap url dll
            ]
        );

        // Optional: update order status juga
        \App\Models\Order::where('id', $orderId)->update([
            'status' => 'selesai',
            'waktu_selesai' => now()
        ]);
    }

    return response()->json(['message' => 'Notifikasi diproses']);
}

}