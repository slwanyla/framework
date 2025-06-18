<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tarif;

class DashboardController extends Controller
{
    public function index()
    {
        $tarifs = Tarif::all(); // ambil semua data dari tabel 'tarifs'
        return view('admin.dashboard', compact('tarifs'));
    }
}
