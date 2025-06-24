<<<<<<< HEAD
@extends('layouts.admin')

@section('content')
  <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Laporan Transaksi -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="font-semibold mb-2 text-accent">Laporan Transaksi & Aktivitas</h2>
      <div class="flex justify-between">
        <div>
          <p class="text-gray-600">Jumlah Perjalanan</p>
          <p class="text-xl font-bold text-accent">230</p>
        </div>
        <div>
          <p class="text-gray-600">Driver Aktif</p>
          <p class="text-xl font-bold text-accent">150</p>
        </div>
        <div>
          <p class="text-gray-600">Penghasilan Hari Ini</p>
          <p class="text-xl font-bold text-accent">Rp 9.500.000</p>
        </div>
      </div>
    </div>

    <!-- Manajemen Tarif -->
    <div class="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h2 class="font-semibold mb-2 text-accent">Manajemen Tarif</h2>
      <p class="text-gray-600 mb-3">Konfigurasi dasar per kilometer, dan biaya tambahan</p>

      <table class="w-full table-auto border border-gray-300 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-3 py-2 border">Jenis</th>
            <th class="px-3 py-2 border">Tarif/km</th>
            <th class="px-3 py-2 border">Minimum</th>
            <th class="px-3 py-2 border">Tambahan</th>
          </tr>
        </thead>
        <tbody>
          @forelse ($tarifs as $tarif)
            <tr>
              <td class="px-3 py-2 border">{{ $tarif->jenis_kendaraan }}</td>
              <td class="px-3 py-2 border">Rp {{ number_format($tarif->tarif_per_km) }}</td>
              <td class="px-3 py-2 border">Rp {{ number_format($tarif->tarif_minimum ?? 0) }}</td>
              <td class="px-3 py-2 border">Rp {{ number_format($tarif->biaya_tambahan ?? 0) }}</td>
            </tr>
          @empty
            <tr>
              <td colspan="5" class="text-center px-4 py-2 border text-gray-500">Belum ada data tarif.</td>
            </tr>
          @endforelse
        </tbody>
      </table>

      <div class="mt-4 text-right">
        <a href="{{ route('admin.tarif.index') }}" class="text-sm text-primary hover:underline">Kelola Tarif Lengkap →</a>
      </div>
    </div>

    <!-- Manajemen Pengguna -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="font-semibold mb-2 text-accent">Manajemen Pengguna & Driver</h2>
      <p class="text-gray-600">Validasi Pendaftaran, aktif/nonaktif akun</p>
    </div>

    <!-- Kontrol Status Driver -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="font-semibold mb-2 text-accent">Kontrol Status Driver</h2>
      <div class="flex justify-between items-center">
        <p class="text-gray-600">Cek status online/offline driver</p>
        <a href="{{ route('admin.driver.status') }}" class="px-4 py-1 bg-primary text-white rounded">Lihat</a>
      </div>
    </div>

  </section>
=======
@extends('layouts.admin')

@section('content')
  <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Laporan Transaksi -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="font-semibold mb-2 text-accent">Laporan Transaksi & Aktivitas</h2>
      <div class="flex justify-between">
        <div>
          <p class="text-gray-600">Jumlah Perjalanan</p>
          <p class="text-xl font-bold text-accent">230</p>
        </div>
        <div>
          <p class="text-gray-600">Driver Aktif</p>
          <p class="text-xl font-bold text-accent">150</p>
        </div>
        <div>
          <p class="text-gray-600">Penghasilan Hari Ini</p>
          <p class="text-xl font-bold text-accent">Rp 9.500.000</p>
        </div>
      </div>
    </div>

    <!-- Manajemen Tarif -->
    <div class="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h2 class="font-semibold mb-2 text-accent">Manajemen Tarif</h2>
      <p class="text-gray-600 mb-3">Konfigurasi dasar per kilometer, dan biaya tambahan</p>

      <table class="w-full table-auto border border-gray-300 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-3 py-2 border">Jenis</th>
            <th class="px-3 py-2 border">Tarif/km</th>
            <th class="px-3 py-2 border">Minimum</th>
            <th class="px-3 py-2 border">Tambahan</th>
          </tr>
        </thead>
        <tbody>
          @forelse ($tarifs as $tarif)
            <tr>
              <td class="px-3 py-2 border">{{ $tarif->jenis_kendaraan }}</td>
              <td class="px-3 py-2 border">Rp {{ number_format($tarif->tarif_per_km) }}</td>
              <td class="px-3 py-2 border">Rp {{ number_format($tarif->tarif_minimum ?? 0) }}</td>
              <td class="px-3 py-2 border">Rp {{ number_format($tarif->biaya_tambahan ?? 0) }}</td>
            </tr>
          @empty
            <tr>
              <td colspan="5" class="text-center px-4 py-2 border text-gray-500">Belum ada data tarif.</td>
            </tr>
          @endforelse
        </tbody>
      </table>

      <div class="mt-4 text-right">
        <a href="{{ route('admin.tarif.index') }}" class="text-sm text-primary hover:underline">Kelola Tarif Lengkap →</a>
      </div>
    </div>

    <!-- Manajemen Pengguna -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="font-semibold mb-2 text-accent">Manajemen Pengguna & Driver</h2>
      <p class="text-gray-600">Validasi Pendaftaran, aktif/nonaktif akun</p>
    </div>

    <!-- Kontrol Status Driver -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="font-semibold mb-2 text-accent">Kontrol Status Driver</h2>
      <div class="flex justify-between items-center">
        <p class="text-gray-600">Cek status online/offline driver</p>
        <a href="{{ route('admin.driver.status') }}" class="px-4 py-1 bg-primary text-white rounded">Lihat</a>
      </div>
    </div>

  </section>
>>>>>>> 5062047835e2f819e207cd96ca4d31c0f6864acf
@endsection