<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;

class DriverStatusController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Driver::with('user');

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where(function ($subQuery) use ($search) {
                    $subQuery->where('username', 'like', "%$search%")
                             ->orWhere('email', 'like', "%$search%");
                });
            });
        }

        $drivers = $query->get();

        return view('admin.driver-status', compact('drivers'));
    }
}