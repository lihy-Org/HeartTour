<?php

namespace App\Http\Controllers\Beautician;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $_userRepository)
    {
        $this->userRepository = $_userRepository;
    }
    /**
     * @OA\Get(
     *     path="/api/beaut/user/info",
     *     tags={"技师公众号系统-人员信息"},
     *     summary="个人信息",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           required={})
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
     *                   example="获取列表成功!",
     *                   property="msg",
     *                   description="提示信息",
     *                   type="string",
     *              ),
     *             @OA\Property(
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
     *               )   ,
     *          @OA\Property(
     *                  type="string",
     *                  property="msg",
     *                  description="提示信息",
     *                  example="获取列表失败!",
     *              ),
     *          @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="{'page':['\u8bf7\u8f93\u5165\u5355\u4f4d\u540d\u79f0\uff01']}",
     *              )
     *         )
     *     )
     * )
     */
    public function GetInfo(Request $request)
    {
        $user = $this->userRepository->GetInfo($request->user->id);
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取成功!',
                'data' => $user,
            )
        );

    }

    /**
     * @OA\Get(
     *     path="/api/beaut/user/kpi",
     *     tags={"技师公众号系统-人员信息"},
     *     summary="个人月度kpi信息",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\Parameter(name="month", in="query", @OA\Schema(type="string"), required=true, description="月份"),
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
     *                   example="获取列表成功!",
     *                   property="msg",
     *                   description="提示信息",
     *                   type="string",
     *              ),
     *             @OA\Property(
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
     *               )   ,
     *          @OA\Property(
     *                  type="string",
     *                  property="msg",
     *                  description="提示信息",
     *                  example="获取列表失败!",
     *              ),
     *          @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="{'page':['\u8bf7\u8f93\u5165\u5355\u4f4d\u540d\u79f0\uff01']}",
     *              )
     *         )
     *     )
     * )
     */
    public function GetKpi(Request $request)
    {
        $rules = [
            'month' => ['required', 'date_format:"Y-m"'],
        ];
        $messages = [];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        $data = (object) $request->all();
        $data->userId = $request->user->id;
        $user = $this->userRepository->GetKpi($data);
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取成功!',
                'data' => $user,
            )
        );
    }

    /**
     * @OA\Get(
     *     path="/api/beaut/user/appt",
     *     tags={"技师公众号系统-人员信息"},
     *     summary="个人某天预约信息",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\Parameter(name="month", in="query", @OA\Schema(type="string"), required=true, description="月份"),
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
     *                   example="获取列表成功!",
     *                   property="msg",
     *                   description="提示信息",
     *                   type="string",
     *              ),
     *             @OA\Property(
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
     *               )   ,
     *          @OA\Property(
     *                  type="string",
     *                  property="msg",
     *                  description="提示信息",
     *                  example="获取列表失败!",
     *              ),
     *          @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="{'page':['\u8bf7\u8f93\u5165\u5355\u4f4d\u540d\u79f0\uff01']}",
     *              )
     *         )
     *     )
     * )
     */
    public function GetApptData(Request $request)
    {
        $rules = [
            'day' => ['required', 'date_format:"Y-m-d"'],
        ];
        $messages = [];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        $data = (object) $request->all();
        $data->userId = $request->user->id;
        $user = $this->userRepository->GetApptData($data);
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取成功!',
                'data' => $user,
            )
        );

    }

}
