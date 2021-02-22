<?php

namespace App\Http\Controllers\StoreSystem;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $_userRepository)
    {
        $this->userRepository = $_userRepository;
    }
    /**
     * @OA\Post(
     *     path="/api/storesys/user/list",
     *     tags={"门店管理系统-人员管理"},
     *     summary="人员列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="门店编号", property="storeId", type="number", default="13888888888"),
     *           @OA\Property(description="职位", property="post", type="string", default=""),
     *           @OA\Property(description="性别", property="gender", type="string", default=""),
     *           @OA\Property(description="条数", property="pageSize", type="number", default="10"),
     *           @OA\Property(description="页数", property="page", type="number", default="1"),
     *           @OA\Property(description="关键字", property="searchKey", type="string", default=""),
     *           required={"storeId","post"})
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
    public function GetList(Request $request)
    {
        $rules = [
            'storeId' => ['uuid'],
            'post' => ['string'],
            'gender' => ['string'],
            'searchKey' => ['string'],
            'pageSize' => ['integer', 'gt:0'],
            'page' => ['integer', 'gt:0'],
        ];
        $messages = [];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        } else {
            $data = (object) $request->all();
            $data = $request->user->storeId;
            $takeNum = isset($data->pageSize) ? $data->pageSize : 10;
            $page = isset($data->page) ? $data->page : 1;
            $skipNum = ($page - 1) * $takeNum;
            $users = $this->userRepository->GetList($data);
            $total = $users->count();
            $list = $users->skip($skipNum)->take($takeNum)->get();
            $pageTotal = $total / $takeNum;
            $result['pages']['total'] = is_int($pageTotal) ? ($pageTotal) : (floor($pageTotal) + 1);
            $result['pages']['pageNo'] = $page;
            $result['data'] = $list;
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '获取列表成功!',
                    'data' => $result,
                )
            );

        }
    }
   

    /**
     * @OA\Post(
     *     path="/api/storesys/user/SetWorktime",
     *     tags={"门店管理系统-人员管理"},
     *     summary="人员排期",       *     
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="userId", type="string", default="10"),
     *           @OA\Property(description="排期日期", property="days", type="string", default="10"),
     *           @OA\Property(description="排期当天开始时间 09:00", property="startTime", type="string", default="10"),
     *           @OA\Property(description="排期当天结束时间 21:00", property="endTime", type="string", default="10"),
     *           required={"userId"}
     *           )
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
     *                  example="成功!",
     *              )
     *         ),
     *     ),
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
     *                  example="失败!",
     *               )
     *           )
     *       ),
     * )
     */
    public function SetWorktime(Request $request)
    {
        $rules = [
            'days' => ['required', 'array'],
            'days.*'=>['date_format:"Y-m-d"','after_or_equal:today'],
            'startTime' => ['nullable', 'date_format:"H:i"'],
            'endTime' => ['nullable', 'date_format:"H:i"'],
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query)use($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('storeId', $request->user->storeId);
            })],
        ];
        $messages = [
            'userId.required' => '请输入人员编号!',
            'userId.exists' => '错误的人员编号或该用户不是该门店!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        return json_encode($this->userRepository->SetWorktime((object) $request->all()));
    }
}
