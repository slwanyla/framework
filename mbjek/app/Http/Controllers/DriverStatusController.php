<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DriverStatusController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Driver::with(['user', 'activityLogs']);

        if ($status !== null) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('nama', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        $drivers = $query->get()->map(function ($driver) {
            // Hitung frekuensi aktivitas (7 hari terakhir)
            $activityCount = $driver->activityLogs()
                ->where('created_at', '>=', Carbon::now()->subDays(7))
                ->count();
            
            // Hitung persentase performa (maksimal 10 aktivitas = 100%)
            $driver->performance = min(100, $activityCount * 10);
            
            return $driver;
        });

        return view('admin.driver-status', compact('drivers'));
    }
}
