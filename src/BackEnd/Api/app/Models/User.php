<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens,Notifiable;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id','name', 'phone', 'avatar','gender','age','title','postId','post','type','storeId','store','state'
    ];  
}
