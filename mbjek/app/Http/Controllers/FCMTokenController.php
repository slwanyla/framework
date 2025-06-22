<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FcmToken;

class FCMTokenController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'token' => 'required|string',
            'device_type' => 'nullable|string',
        ]);

        // Simpan atau update token untuk user+device
        FcmToken::updateOrCreate(
            [
                'user_id' => $request->user_id,
                'token' => $request->token,
            ],
            [
                'device_type' => $request->device_type ?? 'unknown',
            ]
        );

        return response()->json(['message' => 'Token disimpan']);
    }

   

// public function simpanFcmToken(Request $request)
//{
   // $user = auth()->user();
    //$user->fcm_token = $request->fcm_token;
    //$user->save();

    // return response()->json(['message' => 'FCM token disimpan']);
// }


}
