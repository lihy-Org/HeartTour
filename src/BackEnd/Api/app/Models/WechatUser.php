<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WechatUser extends Authenticatable
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'wechatUser';
    protected $primaryKey = 'id';
    use HasApiTokens;
    protected $fillable = ['gender', 'province', 'city', 'country', 'username', 'nickname', 'avatar', 'openid', 'sessionkey', 'token', 'code', 'phone'];
}
