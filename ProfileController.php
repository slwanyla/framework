<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',

            // Validasi tambahan jika user adalah driver
            'vehicle_type' => 'nullable|string|max:255',
            'vehicle_color' => 'nullable|string|max:255',
            'vehicle_plate' => 'nullable|string|max:20',
        ]);

        /**
 * @var \App\Models\User $user
 */

        // Update data user
        $user->username = $request->username;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->save();

        // Jika user adalah driver, update data kendaraan
        if ($user->role === 'driver' && $user->driver) {
            $user->driver->vehicle_type = $request->vehicle_type;
            $user->driver->vehicle_color = $request->vehicle_color;
            $user->driver->vehicle_plate = $request->vehicle_plate;
            $user->driver->save();
        }

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $user = Auth::user();

        // Hapus foto lama jika ada
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Simpan file baru

        $path = $request->file('profile_picture')->store('profile_pictures', 'public');
        
        /**
 * @var \App\Models\User $user
 */
        $user->profile_picture = $path;
        $user->save();

        return back()->with('success', 'Foto profil diperbarui!');
    }

    public function deleteProfilePicture()
    {
        /**
 * @var \App\Models\User $user
 */
        $user = Auth::user();

        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
            $user->profile_picture = null;
            $user->save();
        }

        return back()->with('success', 'Foto profil dihapus.');
    }
}