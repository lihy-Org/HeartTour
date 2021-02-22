<?php

namespace App\Http\Controllers\WechatUser;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/address/update",
     *     tags={"小程序-收货地址"},
     *     summary="新增或修改收货地址",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="收货地址id", property="addrId", type="string", default="dd"),
     *           @OA\Property(description="收件人姓名", property="name", type="string", default="dd"),
     *           @OA\Property(description="手机号码", property="phone", type="string", default="dd"),
     *           @OA\Property(description="地址", property="address", type="string", default="dd"),
     *           @OA\Property(description="门牌号", property="doorplate", type="string", default="dd"),
     *           @OA\Property(description="是否默认：0非默认 1默认", property="default", type="string", default="dd"),     * 
     *           required={"name","phone","address"})
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
     *                  example="新增/修改收货地址信息成功!",
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
     *                  example="修改收货地址信息失败!",
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
    public function AddOrUpdate(Request $request)
    {
        $rules = [
            'name' => ['required', 'string'],
            'phone' => ['required', 'string', 'regex:/^1[3456789][0-9]{9}$/'],
            'address' => ['required', 'string'],
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
                'msg' => '新增/修改收货地址失败!',
                'data' => $validator->errors(),
            ));
        } else {
            //如果此地址是默认，则把其他地址调整为非默认
            if ($request->default == 1) {
                Address::where('uid', $request->user->id)->update(['default' => 0]);
            }
            $addr = Address::updateOrCreate(
                ['id' => $request->addrId], [
                    'uid' => $request->user->id,
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'doorplate' => $request->doorplate,
                    'default' => is_null($request->default) || empty($request->default) ? 0 : $request->default,
                ]);
            if ($addr) {
                return json_encode(
                    array(
                        'status' => 200,
                        'msg' => '新增/修改地址成功!',
                        'data' => '',
                    )
                );

            } else {
                return json_encode(
                    array(
                        'status' => 500,
                        'msg' => '新增/修改地址失败!',
                        'data' => '',
                    )
                );

            }
        }
    }
    /**
     * @OA\Get(
     *     path="/api/address/list",
     *     tags={"小程序-收货地址"},
     *     summary="获取收货地址列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
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
     *                  example="获取收货地址列表成功!",
     *              ),
     *            @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="[{'addrId':2,'name':'xxx','phone':'13828242712','address':'\u8fbe\u5a03\u5927','default':0},{'addrId':3,'name':'xxx1111','phone':'13828242712','address':'\u8fbe\u5a03\u59271111','default':0},{'addrId':4,'name':'xxx1111','phone':'13828242712','address':'\u8fbe\u5a03\u59271111','default':0},{'addrId':6,'name':'xxx1111','phone':'13828242712','address':'\u8fbe\u5a03\u59273333','default':1}]",
     *              )
     *         ),
     *    )
     * )
     */
    function GetList(Request $request) {
        $addrs = Address::where('uid', $request->user->id)->select('id as addrId', 'name', 'phone', 'address', 'doorplate','default')->get();
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取收货地址列表成功!',
                'data' => $addrs)
        );
    }

    /**
     * @OA\Post(
     *     path="/api/address/delete",
     *     tags={"小程序-收货地址"},
     *     summary="删除收货地址信息",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\Parameter(name="addrId", in="query", @OA\Schema(type="int"), required=true, description="addrId"),
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
     *                  example="删除收货地址成功!",
     *              )
     *         ),
     *    )
     * )
     */
    public function Delete(Request $request)
    {
        $addr = Address::where('uid', $request->user->id)->where('id', $request->addrId)->first();
        if ($addr) {
            $addr->delete();
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '删除收货地址信息成功!',
                    'data' => '')
            );
        }
        return json_encode(
            array(
                'status' => 500,
                'msg' => '删除收货地址失败!',
                'data' => '')
        );
    }

}
