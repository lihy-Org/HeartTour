<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class WechatUser extends Authenticatable
{

    use HasApiTokens;
    protected $fillable = ['gender', 'province', 'city', 'country', 'username', 'nickname', 'avatar', 'openid', 'sessionkey', 'token', 'code', 'phone'];
}
