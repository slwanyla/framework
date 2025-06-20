<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DriverController; 
use App\Http\Controllers\LogoutController; 
use App\Http\Controllers\BerandaController;
use App\Http\Controllers\Midtrans;
use App\Http\Controllers\FCMTokenController;
use App\Http\Controllers\MidtransCallbackController;


// ✨ Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify', [AuthController::class, 'verify']);
Route::post('/resend-verification-code', [AuthController::class, 'resendVerificationCode']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);
Route::post('/resend-reset-link', [ForgotPasswordController::class, 'resendResetLink']);


Route::post('/midtrans-token', [Midtrans::class, 'getSnapToken']);

Route::get('/proxy-search', function (Request $request) {
    $query = $request->query('q');
    $viewbox = '105.0,-5.0,115.0,-8.0';
    $url = "https://nominatim.openstreetmap.org/search?format=jsonv2&q=" . urlencode($query) . "&viewbox={$viewbox}&bounded=1";

    $response = Http::withHeaders([
        'User-Agent' => 'MbjekApp/1.0'
    ])->get($url);

    return $response->json();
});

// ✨ Tracking order tanpa login (boleh public)


// ✨ Routes yang butuh token login
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::get('/profile', [ProfileController::class, 'profile']);
    Route::put('/update-profile', [ProfileController::class, 'updateProfile']);
    Route::post('/profile-upload-photo', [ProfileController::class, 'uploadPhoto']);
    
    // 🟢 Tambahkan di sini: status order & update lokasi driver
    Route::post('/buat-order', [OrderController::class, 'buatOrder']);
    Route::post('/cek-tarif', [OrderController::class, 'cekTarif']);
    Route::post('/order/update-status', [OrderController::class, 'updateStatus']);
    Route::get('/order/{id}/tracking', [OrderController::class, 'tracking']);
    Route::get('/order-status/{id}', [OrderController::class, 'cekStatus']);
    Route::post('/batalkan-order', [OrderController::class, 'batalkanOrder']);

    Route::get('/order-driver-terbaru', [OrderController::class, 'getOrderTerbaru']);
    Route::post('/order/terima', [OrderController::class, 'terimaOrder']);




    Route::post('/midtrans/callback', [MidtransCallbackController::class, 'handle']);

    Route::post('/driver/update-location', [DriverController::class, 'updateLocation']);
    Route::post('/driver/update-status', [DriverController::class, 'updateStatus']);

    Route::post('/save-fcm-token', [FCMTokenController::class, 'store']);

    
   

    Route::post('/beranda', [BerandaController::class, 'GetLocation']);
    Route::get('/riwayat-pesanan', [HistoryController::class, 'riwayatOrder']);

    

    Route::post('/logout', [LogoutController::class, 'logout']);


});
