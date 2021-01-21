<?php

namespace App\Http\Middleware;

use App\Models\WechatUser;
use Closure;

class WechatAppApi
{
    public function handle($request, Closure $next)
    {
        $token = $request->header('token');
        if (!$token) {
            return response()->json(array('status' => 401, 'msg' => 'no token'));
        }
        $user = WechatUser::where('token', $token)->where('status', 1)->where('type', 1)->first();
        //没有用户
        if (!$user) {
            return response()->json(array('status' => 401, 'msg' => 'error token'));
        };
        $request->user = $user;
        return $next($request);
    }
}
