<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WechatUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
     /**
     * @OA\Info(
     *     version="1.0",
     *     title="心之旅"
     * )
     */

    /**
     * @OA\Post(
     *     path="/api/admin/login",
     *     tags={"总台管理系统-用户管理"},
     *     summary="登录",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户名", property="username", type="string", default=""),
     *           @OA\Property(description="密码", property="password", type="string", default=""),
     *           required={"username","password"})
     *       )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="成功",
     *         @OA\JsonContent(
     *            type="object",
     *            @OA\Property(
     *                   example="200",
     *                   property="status",
     *                   description="状态码",
     *                   type="number",
     *               ),
     *            @OA\Property(
     *                   example="登录成功!",
     *                   property="msg",
     *                   description="提示信息",
     *                   type="string",
     *              ),
     *            @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="",
     *              )
     *         )),
     *       @OA\Response(
     *         response=500,
     *         description="失败",
     *         @OA\JsonContent(
     *            type="object",
     *            @OA\Property(
     *                   example="500",
     *                   property="status",
     *                   description="状态码",
     *                   type="number",
     *               ),
     *          @OA\Property(
     *                  type="string",
     *                  property="msg",
     *                  description="提示信息",
     *                  example="登录失败!",
     *              ),
     *          @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="错误信息",
     *              )
     *         )
     *     )
     * )
     */
    public function Auth(Request $request)
    {
        $rules = [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
        $messages = [
            'name.required' => '请填写收件人!',
            'phone.required' => '请填写联系手机!',
            'phone.regex' => '请填写正确的手机号码!',
            'address.required' => '请填写收货地址!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '登录失败!',
                'data' => $validator->errors(),
            ));
        } else {
            $user = User::where('username', $request->username)->first();
            if (!$user || !Hash::check($request->password, $user->password)) {
                return json_encode(
                    array(
                        'status' => 500,
                        'msg' => '账号密码错误!',
                        'data' => '')
                );
            }
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '登录成功!',
                    'data' => $user->createToken($request->username)->plainTextToken)
            );

        }
    }  
    
}
