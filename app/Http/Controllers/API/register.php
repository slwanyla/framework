<?php

// App\Http\Controllers\API\AuthController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationCodeMail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'phone' => 'required|string',
            'role' => 'required|in:customer,driver',
        ]);

        // Bikin OTP
        $verificationCode = sprintf('%04d', rand(0, 9999));

        // Simpan user
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'verification_code' => $verificationCode,
            'is_verified' => false,
        ]);

        // Kirim OTP ke email
        Mail::to($user->email)->send(new VerificationCodeMail($user, $verificationCode));

        return response()->json([
            'message' => 'User registered. Verification code sent to email.',
            'user' => $user
        ], 201);
    }
}
