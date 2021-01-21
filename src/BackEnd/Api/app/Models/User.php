<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens,Notifiable;
   
    protected $fillable = [
        'username', 'email', 'phone','password','status'
    ];
    
    protected $hidden = [
        'password', 'remember_token',
    ];

}
