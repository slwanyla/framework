<?php

namespace App\Http\Controllers;

use App\Mail\VerificationCodeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function showSignUp()
    {
        return view('auth.signup');
    }

    public function showLogin()
    {
        return view('auth.login');
    }

    public function signUp(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required',
            'password' => 'required|min:6',
            'role' => 'required|in:customer,driver',
        ]);

        // Generate 4 digit verification code
        $verificationCode = sprintf('%04d', rand(0, 9999));

        // Create user
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'verification_code' => $verificationCode,
            'is_verified' => false,
        ]);

        // Send verification email
        Mail::to($user->email)->send(new VerificationCodeMail($user, $verificationCode));

        return redirect()->route('verification', ['email' => $user->email])
            ->with('success', 'Pendaftaran berhasil! Silakan verifikasi email Anda.');
    }

    public function showVerification(Request $request)
    {
        $email = $request->email;
        return view('auth.verification', compact('email'));
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'digit1' => 'required|numeric',
            'digit2' => 'required|numeric',
            'digit3' => 'required|numeric',
            'digit4' => 'required|numeric',
        ]);

        $verificationCode = $request->digit1 . $request->digit2 . $request->digit3 . $request->digit4;
        $user = User::where('email', $request->email)
                    ->where('verification_code', $verificationCode)
                    ->first();

        if (!$user) {
            return back()->withErrors(['message' => 'Kode verifikasi tidak valid']);
        }

        // Update user verification status
        $user->is_verified = true;
        $user->verification_code = null;
        $user->save();

        // Auto login
        Auth::login($user);

        return redirect()->route('home')->with('success', 'Akun berhasil diverifikasi!');
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required', // Username atau Email atau No Handphone
            'password' => 'required',
        ]);

        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        
        if (is_numeric($request->login)) {
            $loginField = 'phone';
        }

        $credentials = [
            $loginField => $request->login,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials)) {
            // Cek apakah user sudah diverifikasi
            if (!Auth::user()->is_verified) {
                Auth::logout();
                
                // Generate new verification code
                $verificationCode = sprintf('%04d', rand(0, 9999));
                $user = User::where($loginField, $request->login)->first();
                $user->verification_code = $verificationCode;
                $user->save();
                
                // Send verification email
                Mail::to($user->email)->send(new VerificationCodeMail($user, $verificationCode));
                
                return redirect()->route('verification', ['email' => $user->email])
                    ->with('warning', 'Akun belum diverifikasi. Kode baru telah dikirim ke email Anda.');
            }
            
            return redirect()->route('home');
        }

        return back()->withErrors([
            'login' => 'Username/email/handphone atau password salah',
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('login');
    }

    public function resendVerificationCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        
        // Generate new verification code
        $verificationCode = sprintf('%04d', rand(0, 9999));
        $user->verification_code = $verificationCode;
        $user->save();
        
        // Send verification email
        Mail::to($user->email)->send(new VerificationCodeMail($user, $verificationCode));
        
        return back()->with('success', 'Kode verifikasi baru telah dikirim ke email Anda.');
    }
}