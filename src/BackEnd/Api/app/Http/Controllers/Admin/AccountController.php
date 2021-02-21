<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Utilities\SmsSeveice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

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
            'phone' => ['required', 'regex:/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$/'],
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
            $user = User::where('phone', $phone)->where(function($query){
                $query->where('type', 1)->orWhere('type', 0);
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
     *     path="/api/admin/verifCode",
     *     tags={"总台管理系统-用户管理"},
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
    public function GetVerifCode(Request $request)
    {
        $rules = [
            'phone' => ['required', 'regex:/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$/'],
        ];
        $messages = [
            'phone.required' => '请输入正确手机号码！',
            'phone.regex' => '请输入正确手机号码！',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return array(
                'status' => 500,
                'msg' => '请输入正确手机号码！',
                'data' => $validator->errors(),
            );
        } else {
            $phone = $request['phone'];
            if (Cache::has($phone . '_code')) {
                $value = Cache::get($phone . '_code');
                $date = Carbon::parse(explode(',', $value)[1])->addMinutes(1);
                //超过一分钟才可以继续发送
                if (Carbon::now()->gte($date)) {
                    return $this->SendVerifCode($phone);
                } else {
                    return array(
                        'status' => 500,
                        'msg' => '一分钟内只能发送一次!',
                        'data' => '',
                    );
                }
            } else {
                return $this->SendVerifCode($phone);
            }
        }
    }
    //发送随机验证码
    protected function SendVerifCode($phone)
    {
        $lower = 100000;
        $upper = 999999;
        $code = mt_rand($lower, $upper);

        $arr = ['code' => $code];
        $sms = new SmsSeveice();
        $msg = '{"code":"' . $code . '"}';
        $res = $sms->SendMsg($msg, $phone, 'SMS_199202193');
        if ($res['Message'] == "OK") {
            Cache::put($phone . '_code', $code . ',' . Carbon::now());
            return array(
                'status' => 200,
                'msg' => '发送成功!',
                'data' => '',
            );
        } else {
            return array(
                'status' => 500,
                'msg' => '发送失败!',
                'data' => $res['Message'],
            );
        }
    }

}
