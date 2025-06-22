<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;

class HistoryController extends Controller
{
   public function riwayatLayanan($driverId)
{
    $orders = Order::with(['customer', 'payment', 'driver.user'])
        ->where('driver_id', $driverId)
        ->whereIn('status', ['selesai', 'dibatalkan']) 
        ->orderByDesc('waktu_selesai')
        ->get();

    return response()->json([
        'success' => true,
        'riwayat' => $orders->map(function ($order) {
            $isCanceled = $order->status === 'dibatalkan';

            return [
                'tanggal' => $isCanceled
                    ? ($order->canceled_at ? $order->canceled_at->format('Y-m-d H:i') : '-')
                    : ($order->waktu_selesai ? $order->waktu_selesai->format('Y-m-d H:i') : '-'),
                'status' => $order->status,
                'deskripsi' => $isCanceled
                    ? 'Order dibatalkan oleh ' . ($order->dibatalkan_oleh ?? '-') . 
                      ($order->alasan_batal ? ' (Alasan: ' . $order->alasan_batal . ')' : '')
                    : 'Perjalanan dari ' . $order->lokasi_jemput . ' ke ' . $order->lokasi_tujuan,
                'harga' => $isCanceled ? 0 : $order->tarif,
                'kendaraan' => $order->tipe_kendaraan,
                'bukti_transaksi' => $order->bukti_transaksi,
                'driver' => [
                    'nama' => $order->driver->user->nama ?? '-',
                    'plat' => $order->driver->no_plat ?? '-',
                ],
                'metode_pembayaran' => optional($order->payment)->status === 'sudah_bayar' ? 'QRIS' : 'Tunai'
            ];
        })
    ]);
}

public function riwayatCustomer($customerId)
{
    $orders = Order::with(['driver.user', 'payment'])
        ->where('customer_id', $customerId)
        ->whereIn('status', ['selesai', 'dibatalkan'])
        ->orderByDesc('waktu_selesai')
        ->get();

    return response()->json([
        'success' => true,
        'riwayat' => $orders->map(function ($order) {
            $isCanceled = $order->status === 'dibatalkan';

            return [
                'tanggal' => $isCanceled
                    ? ($order->canceled_at ? $order->canceled_at->format('Y-m-d H:i') : '-')
                    : ($order->waktu_selesai ? $order->waktu_selesai->format('Y-m-d H:i') : '-'),
                'status' => $order->status,
                'deskripsi' => $isCanceled
                    ? 'Order dibatalkan oleh ' . ($order->dibatalkan_oleh ?? '-') . 
                      ($order->alasan_batal ? ' (Alasan: ' . $order->alasan_batal . ')' : '')
                    : 'Perjalanan dari ' . $order->lokasi_jemput . ' ke ' . $order->lokasi_tujuan,
                'harga' => $isCanceled ? 0 : $order->tarif,
                'kendaraan' => $order->tipe_kendaraan,
                'bukti_transaksi' => $order->bukti_transaksi,
                'driver' => [
                    'nama' => $order->driver->user->nama ?? '-',
                    'plat' => $order->driver->no_plat ?? '-',
                ],
                'metode_pembayaran' => optional($order->payment)->status === 'sudah_bayar' ? 'QRIS' : 'Tunai'
            ];
        })
    ]);
}


}
