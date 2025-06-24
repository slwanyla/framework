<<<<<<< HEAD
@extends('layouts.admin')

@section('content')
    <div class="space-y-4">
        <h2 class="text-xl font-semibold text-accent">Kontrol Status Driver</h2>

        <!-- Filter -->
        <div class="flex flex-wrap items-center space-x-4">
            <select class="border border-gray-300 rounded px-2 py-1">
                <option>Semua Status</option>
                <option>Online</option>
                <option>Offline</option>
            </select>
            <input type="text" class="border border-gray-300 rounded px-2 py-1 w-64" placeholder="Cari berdasarkan nama atau status">
            <button class="bg-primary text-white px-4 py-1 rounded hover:bg-blue-800">Cari</button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-300 mt-4 rounded shadow">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="py-2 px-4 border-b">No</th>
                        <th class="py-2 px-4 border-b">Nama</th>
                        <th class="py-2 px-4 border-b">Status</th>
                        <th class="py-2 px-4 border-b">Waktu Mulai</th>
                        <th class="py-2 px-4 border-b">Performa</th>
                    </tr>
                </thead>
                <tbody>
                @foreach($drivers as $index => $driver)
                    @php
                        $status = optional($driver->driver)->status;
                        $startTime = optional($driver->driver)->start_time;
                        $statusColor = $status === 'offline' ? 'text-red-600' : ($status === 'online' ? 'text-green-600' : '');
                    @endphp
                    <tr>
                        <td class="py-2 px-4 border-b">{{ $index + 1 }}</td>
                        <td class="py-2 px-4 border-b">{{ $driver->name ?? '-' }}</td>
                        <td class="py-2 px-4 border-b {{ $statusColor }}">
                            {{ $status ?? '-' }}
                        </td>
                        <td class="py-2 px-4 border-b">
                            {{ $startTime ? \Carbon\Carbon::parse($startTime)->format('H:i') . ' WIB' : '-' }}
                        </td>
                        <td class="py-2 px-4 border-b">-</td> <!-- Bisa diganti rating/performa -->
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>
=======
@extends('layouts.admin')

@section('content')
    <div class="space-y-4">
        <h2 class="text-xl font-semibold text-accent">Kontrol Status Driver</h2>

        <!-- Filter -->
        <div class="flex flex-wrap items-center space-x-4">
            <select class="border border-gray-300 rounded px-2 py-1">
                <option>Semua Status</option>
                <option>Online</option>
                <option>Offline</option>
            </select>
            <input type="text" class="border border-gray-300 rounded px-2 py-1 w-64" placeholder="Cari berdasarkan nama atau status">
            <button class="bg-primary text-white px-4 py-1 rounded hover:bg-blue-800">Cari</button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-300 mt-4 rounded shadow">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="py-2 px-4 border-b">No</th>
                        <th class="py-2 px-4 border-b">Nama</th>
                        <th class="py-2 px-4 border-b">Status</th>
                        <th class="py-2 px-4 border-b">Waktu Mulai</th>
                        <th class="py-2 px-4 border-b">Performa</th>
                    </tr>
                </thead>
                <tbody>
                @foreach($drivers as $index => $driver)
                    @php
                        $status = optional($driver->driver)->status;
                        $startTime = optional($driver->driver)->start_time;
                        $statusColor = $status === 'offline' ? 'text-red-600' : ($status === 'online' ? 'text-green-600' : '');
                    @endphp
                    <tr>
                        <td class="py-2 px-4 border-b">{{ $index + 1 }}</td>
                        <td class="py-2 px-4 border-b">{{ $driver->name ?? '-' }}</td>
                        <td class="py-2 px-4 border-b {{ $statusColor }}">
                            {{ $status ?? '-' }}
                        </td>
                        <td class="py-2 px-4 border-b">
                            {{ $startTime ? \Carbon\Carbon::parse($startTime)->format('H:i') . ' WIB' : '-' }}
                        </td>
                        <td class="py-2 px-4 border-b">-</td> <!-- Bisa diganti rating/performa -->
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>
>>>>>>> 5062047835e2f819e207cd96ca4d31c0f6864acf
@endsection