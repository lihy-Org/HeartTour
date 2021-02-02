<?php

namespace App\Http\Controllers\WechatUser;

use App\Http\Controllers\Controller;
use App\Models\WechatUser;
use App\Repositories\CouponRepository;
use App\Utilities\WXBizDataCrypt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WechatUserController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/user/login",
     *     tags={"小程序-用户管理"},
     *     summary="登录",
     *      @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="登录code", property="code", type="string", default="dd"),
     *           required={"code"})
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
     *      @OA\Property(
     *       type="object",
     *           property="data",
     *             @OA\Property(
     *                   example="wa312131dwa42141",
     *                   property="token",
     *                   description="token",
     *                   type="string"
     *               ),
     *      @OA\Property(
     *                   property="isBindPhone",
     *                   description="是否绑定手机",
     *                   type="number"
     *               ),
     *          @OA\Property(
     *                   property="isFirstIn",
     *                   description="是否新用户",
     *                   type="number"
     *               ),
     *             )
     *         )
     *     )
     * )
     */
    public function WeAppLogin(Request $request)
    {
        $code = $request->code;
        // 根据 code 获取微信 openid 和 session_key
        $miniProgram = \EasyWeChat::miniProgram();
        $data = $miniProgram->auth->session($code);
        if (isset($data['errcode'])) {
            return json_encode(array('status' => 401, 'msg' => $data['errmsg'], 'data' => ''));
        }
        $weappOpenid = $data['openid'];
        $weixinSessionKey = $data['session_key'];
        //直接创建token
        $token = md5($data['openid'] . $data['session_key'] . date('Y-m-d', time()));
        //找到 openid 对应的用户
        $user = WechatUser::where('openid', $weappOpenid)->first();
        $isFirstIn = 0;
        //没有，就注册一个用户
        if (!$user) {
            $user = WechatUser::create([
                'code' => $code,
                'openid' => $weappOpenid,
                'sessionkey' => $weixinSessionKey,
                'password' => $weixinSessionKey,
                'token' => $token,
            ]);
        };
        //如果注册过的，就更新下下面的信息
        $user->sessionkey = $weixinSessionKey;
        $user->token = $token;
        // 更新用户数据
        $user->save();
        return json_encode(array(
            'status' => 200,
            'msg' => 'successful',
            'data' => array(
                'token' => $token,
                'isBindPhone' => is_null($user->phone) || empty($user->phone) ? 0 : 1,
                'isFirstIn' => $isFirstIn,
            ),
        ));
    }

    /**
     * @OA\Post(
     *     path="/api/user/edit",
     *     tags={"小程序-用户管理"},
     *     summary="修改用户信息",
     *    @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="昵称", property="nickname", type="string", default="dd"),
     *            @OA\Property(description="头像", property="avatar", type="string", default="dd"),
     *           @OA\Property(description="国家", property="country", type="string", default="dd"),
     *           @OA\Property(description="省", property="province", type="string", default="dd"),
     *           @OA\Property(description="市", property="city", type="string", default="dd"),
     *           @OA\Property(description="性别", property="gender", type="int", default="dd"),
     *           required={"nickname","avatar"})
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
     * @OA\Property(
     *    type="object",
     *       property="data",
     *       example="user",
     * )
     *         )),
     *  *     @OA\Response(
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
     * * @OA\Property(
     *    type="string",
     *     property="msg",
     *     example="error field",
     * ),
     * @OA\Property(
     *    type="object",
     *     property="data",
     *     example="{'avatar':['\u8bf7\u8f93\u5165\u5355\u4f4d\u540d\u79f0\uff01']}",
     * )
     *         )
     *
     *     )
     * )
     */

    public function Edit(Request $request)
    {

        $rules = [
            'nickname' => ['required', 'string'],
            'avatar' => ['required', 'string'],
        ];
        $messages = [
            'nickname.required' => '请输入用户名！',
            'avatar.required' => '请输入头像！',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '修改用户信息失败！',
                'data' => $validator->errors(),
            ));
        } else {
            $nickname = preg_replace("/[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}]/u", "", $request->nickname);
            $avatar = str_replace('/132', '/0', $request->avatar); //拿到分辨率高点的头像
            $country = $request->country ? $request->country : '';
            $province = $request->province ? $request->province : '';
            $city = $request->city ? $request->city : '';
            $gender = is_null($request->gender) || empty($request->gender) ? 1 : 0; //0是男 1是女
            $user = WechatUser::where('id', $request->user->id)->first();
            if ($user) {
                $user->nickname = $nickname;
                $user->avatar = $avatar;
                $user->country = $country;
                $user->province = $province;
                $user->city = $city;
                $user->gender = $gender;
                // 更新用户数据
                $user->save();
                return json_encode(
                    array(
                        'status' => 200,
                        'msg' => '修改用户信息成功！',
                        'data' => '',
                    )
                );
            }
            return json_encode(array(
                'status' => 500,
                'msg' => '修改用户信息失败！',
                'data' => '',
            ));
        }
    }

    /**
     * @OA\Post(
     *     path="/api/user/editphone",
     *     tags={"小程序-用户管理"},
     *     summary="修改手机",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="iv", property="iv", type="string", default="dd"),
     *           @OA\Property(description="encryptedData", property="encryptedData", type="string", default="dd"),
     *           required={"iv","encryptedData"})
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
     *                  type="string",
     *                  property="msg",
     *                  example="修改用户手机成功",
     *              )
     *         )),
     *      @OA\Response(
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
     *           @OA\Property(
     *                  type="string",
     *                  property="msg",
     *                  example="修改用户手机失败",
     *               ),
     *          @OA\Property(
     *                 type="object",
     *                 property="data",
     *                 example="错误信息",
     *              )
     *         )     *
     *     )
     * )
     */
    public function EditPhone(Request $request)
    {
        $rules = [
            'iv' => ['required', 'string'],
            'encryptedData' => ['required', 'string'],
        ];
        $messages = [
            'iv.required' => 'not found iv',
            'encryptedData.required' => 'not found encryptedData',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => 'error field',
                'data' => $validator->errors(),
            ));
        } else {

            $user = WechatUser::where('id', $request->user->id)->first();
            $pc = new WXBizDataCrypt(env('WECHAT_MINI_PROGRAM_APPID'), $user->sessionkey);
            $errCode = $pc->decryptData(urldecode($request->encryptedData), urldecode($request->iv), $data);
            if ($errCode == 0) {
                $user->phone = json_decode($data)->phoneNumber;
                $user->save();
                return json_encode(
                    array(
                        'status' => 200,
                        'msg' => '修改用户手机成功！',
                        'data' => '',
                    )
                );
            } else {
                return json_encode(array(
                    'status' => 500,
                    'msg' => '解密失败！',
                    'data' => $validator->errors(),
                ));
            }
        }
    }   
}
