<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Redirect root to login
// ✅ Redirect root "/" ke halaman login
Route::get('/', function () {
    return redirect()->route('login');
});

// ✅ Form signup & prosesnya
// Menampilkan form pendaftaran (showSignUp) dan memproses datanya (signUp).
Route::get('/signup', [AuthController::class, 'showSignUp'])->name('signup');
Route::post('/signup', [AuthController::class, 'signUp'])->name('signup.process');

// ✅ Form login & prosesnya

Route::post('/login', [AuthController::class, 'login'])->name('login.process');

// ✅ Logout admin
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ✅ Verifikasi kode OTP (untuk email)
Route::get('/verification', [AuthController::class, 'showVerification'])->name('verification');
Route::post('/verification/verify', [AuthController::class, 'verify'])->name('verification.verify');
Route::post('/verification/resend', [AuthController::class, 'resendVerificationCode'])->name('verification.resend');

// ✅ Route yang hanya bisa diakses setelah login (untuk admin)
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
});
