<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens,Notifiable;
   
    protected $fillable = [
        'name', 'phone', 'avatar','gender','age','title','post','type','storeId','storeName','state'
    ];  
}
