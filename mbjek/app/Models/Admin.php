<<<<<<< HEAD
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'tanggal_lahir',
        'alamat',
        'jenis_kelamin',
        'profile_picture',
    ];
=======
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'tanggal_lahir',
        'alamat',
        'jenis_kelamin',
        'profile_picture',
    ];
>>>>>>> 5062047835e2f819e207cd96ca4d31c0f6864acf
}