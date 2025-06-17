<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        return view('profile.edit', compact('user'));
    }

    public function update(Request $request)
    {
        /**
 * @var \App\Models\User $user
 */
        $user = Auth::user();

        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->username = $request->username;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->save();

        return redirect()->route('help')->with('success', 'Profil berhasil diperbarui.');
    }
}
