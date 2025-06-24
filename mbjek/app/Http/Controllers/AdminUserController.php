<<<<<<< HEAD
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->get('role', 'driver');

        if ($role === 'driver') {
            $users = User::where('role', 'driver')->with('driver')->get();
        } else {
            $users = User::where('role', 'customer')->get();
        }

        return view('admin.users.index', compact('users', 'role'));
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Jika user adalah driver, hapus data drivernya juga
        if ($user->role === 'driver') {
            $user->driver()->delete();
        }

        $user->delete();

        return redirect()->route('admin.users')->with('success', 'User berhasil dihapus.');
    }
=======
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->get('role', 'driver');

        if ($role === 'driver') {
            $users = User::where('role', 'driver')->with('driver')->get();
        } else {
            $users = User::where('role', 'customer')->get();
        }

        return view('admin.users.index', compact('users', 'role'));
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Jika user adalah driver, hapus data drivernya juga
        if ($user->role === 'driver') {
            $user->driver()->delete();
        }

        $user->delete();

        return redirect()->route('admin.users')->with('success', 'User berhasil dihapus.');
    }
>>>>>>> 5062047835e2f819e207cd96ca4d31c0f6864acf
}