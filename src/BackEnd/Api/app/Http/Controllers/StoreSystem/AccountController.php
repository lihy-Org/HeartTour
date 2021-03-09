<?php

namespace App\Http\Controllers\StoreSystem;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/storesys/login",
     *     tags={"门店管理系统-授权"},
     *     summary="登录",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="手机号码", property="phone", type="number", default="13888888888"),
     *           @OA\Property(description="验证码", property="code", type="number", default=""),
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
    public function Login(Request $request)
    {

        $rules = [
            'phone' => ['required', Rule::exists('users', 'phone')->where(function ($query) use ($request) {
                $query->where('state', 0)->where('type', 2);
            })],
            'code' => ['required', 'string'],
        ];
        $messages = [
            'phone.required' => '请输入正确手机号码！',
            'phone.regex' => '请输入正确手机号码！',
            'code.required' => '请输入验证码!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '登录失败!',
                'data' => $validator->errors(),
            ));
        } else {
            $code = $request['code'];
            $phone = $request['phone'];
            // if (Cache::has($phone . '_code')) {
            //     $value = Cache::get($phone . '_code');
            //     $values = explode(',', $value);
            //     $date = Carbon::parse($values[1])->addMinutes(10);
            //     if (Carbon::now()->gte($date)) {
            //         return array(
            //             'code' => 500,
            //             'msg' => '验证码超过10分钟已失效，请重新获取！',
            //             'data' => '',
            //         );
            //     } else {
            //         if ($code != $values[0]) {
            //             return array(
            //                 'code' => 500,
            //                 'msg' => '验证码错误！',
            //                 'data' => '',
            //             );
            //         }
            //     }
            // } else {
            //     return array(
            //         'code' => 500,
            //         'msg' => '验证码已失效!',
            //         'data' => '',
            //     );
            // }
            $user = User::where('phone', $phone)->where(function ($query) {
                $query->where('type', 2);
            })->where('state', 0)->first();
            if (!$user) {
                return json_encode(
                    array(
                        'status' => 500,
                        'msg' => '账户已禁用，请联系管理员!',
                        'data' => '')
                );
            }
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '登录成功!',
                    'data' => $user->createToken($user->id)->plainTextToken)
            );

        }
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/verifCode",
     *     tags={"门店管理系统-授权"},
     *     summary="获取登录验证码",
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="手机号码", property="phone", type="number", default="13888888888"),
     *           required={"phone"})
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
     *                   example="获取验证码成功!",
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
     *                  example="获取验证码失败!",
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
}
