<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;

class HistoryController extends Controller
{
    // ✅ Ambil riwayat pemesanan berdasarkan user_id
    public function riwayatOrder(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id'
    ]);

    $orders = Order::where('user_id', $request->user_id)
                   ->orderBy('created_at', 'desc')
                   ->get();

    return response()->json(['riwayat' => $orders]);
}

}
