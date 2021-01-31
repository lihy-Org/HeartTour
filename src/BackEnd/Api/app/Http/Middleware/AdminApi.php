<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;

class AdminApi
{
    public function handle($request, Closure $next)
    {

        $request->user = $request->user();      
        $user = User::where('id', $request->user->id)->where(function ($query) {
            $query->where('type', 1)->orWhere('type', 0);
        })->where('state', 0)->first();
        //没有用户
        if (!$user) {
            return response()->json(array('status' => 401, 'msg' => 'error token'));
        };
        return $next($request);
    }
}
