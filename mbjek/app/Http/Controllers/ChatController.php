<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;

class ChatController extends Controller
{
    public function index($orderId)
    {
        return Chat::where('order_id', $orderId)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer',
            'sender' => 'required|in:user,driver',
            'receiver' => 'required|in:user,driver',
            'message' => 'required|string'
        ]);

        $chat = Chat::create([
            'order_id' => $request->order_id,
            'sender' => $request->sender,
            'receiver' => $request->receiver,
            'message' => $request->message,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json($chat, 201);
    }
}