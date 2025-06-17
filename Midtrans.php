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

        $order = Order::with('customer')->find($request->order_id);

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
                'gross_amount' => round($order->tarif ?? 10000),
            ],
            'customer_details' => [
                'first_name' => optional($order->customer)->nama ?? 'Customer',
                'email' => optional($order->customer)->email ?? 'customer@mbjek.com',
            ],
            'enabled_payments' => ['qris', 'gopay', 'bank_transfer']
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
}