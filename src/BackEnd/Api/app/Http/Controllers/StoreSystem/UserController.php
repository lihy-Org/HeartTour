<?php

namespace App\Http\Controllers\StoreSystem;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\AppointmentRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    protected $userRepository;
    protected $appointmentRepository;

    public function __construct(UserRepository $_userRepository, AppointmentRepository $_appointmentRepository)
    {
        $this->userRepository = $_userRepository;
        $this->appointmentRepository = $_appointmentRepository;
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
     *         @OA\Schema(     *
     *           @OA\Property(description="职位", property="post", type="string", default=""),
     *           @OA\Property(description="性别", property="gender", type="string", default=""),
     *           @OA\Property(description="条数", property="pageSize", type="number", default="10"),
     *           @OA\Property(description="页数", property="page", type="number", default="1"),
     *           @OA\Property(description="关键字", property="searchKey", type="string", default=""),
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
    public function GetList(Request $request)
    {
        $rules = [
            'post' => ['string'],
            'gender' => ['nullable', 'integer', Rule::in([0, 1, 2])],
            'searchKey' => ['nullable', 'string'],
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
            $data->storeId = $request->user->storeId;
            $takeNum = isset($data->pageSize) ? $data->pageSize : 10;
            $page = isset($data->page) ? $data->page : 1;
            $skipNum = ($page - 1) * $takeNum;
            $users = $this->userRepository->GetList($data);
            $total = $users->count();
            $list = $users->skip($skipNum)->take($takeNum)->get();
            $pageTotal = $total / $takeNum;
            $pageRes = (object) [];
            $pageRes->total = $total;
            $pageRes->pageNo = $page;
            $pageRes->pageSize = $takeNum;
            $pageRes->pages = is_int($pageTotal) ? ($pageTotal) : (floor($pageTotal) + 1);
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '获取列表成功!',
                    'data' => $list,
                    'page' => $pageRes,
                )
            );

        }
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/user/setWorktime",
     *     tags={"门店管理系统-人员管理"},
     *     summary="人员排期",       *
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="userId", type="string", default="10"),
     *           @OA\Property(description="排期日期", property="days", type="string", default="10"),
     *           @OA\Property(description="班次配置id", property="freqId", type="string", default="10"),
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
            'days.*.day' => ['required','date_format:"Y-m-d"', 'after_or_equal:today'],
            'days.*.freqId' => ['required', Rule::exists('configs', 'id')],
           
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->user->storeId);
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
        return json_encode($this->appointmentRepository->SetWorktime((object) $request->all()));
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/user/tranStore",
     *     tags={"门店管理系统-人员管理"},
     *     summary="调店",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="userId", type="number", default="10"),
     *           @OA\Property(description="门店ID", property="storeId", type="number", default="10"),
     *           required={"storeId","userId"}
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
    public function TranStore(Request $request)
    {
        $rules = [
            'storeId' => ['required', 'exists:stores,id'],
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                $query->where('state', 0)->whereNotIn('type', [0, 1, 2])->where('storeId', $request->user->storeId);
            }),
            ],
        ];
        $messages = [
            'storeId.required' => '请输入门店编号!',
            'userId.required' => '请输入人员编号!',
            'storeId.exists' => '错误的门店编号!',
            'userId.exists' => '错误的人员编号!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        return json_encode($this->userRepository->SetStore((object) $request->all()));
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/user/setKpi",
     *     tags={"门店管理系统-人员管理"},
     *     summary="设置月度目标",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="userId", type="string", default="10"),
     *           @OA\Property(description="月度 格式 2022-02", property="month", type="string", default="10"),
     *           @OA\Property(description="目标 1111.11", property="kpi", type="string", default="10"),
     *           required={"userId","month","kpi"}
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
    public function SetKpi(Request $request)
    {
        $rules = [
            'month' => ['required', 'date_format:"Y-m"'],
            'kpi' => ['required', 'gt:0'],
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->user->storeId);
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
        $data = (object) $request->all();
        $data->storeId = $request->user->storeId;
        $data->setId = $request->user->id;
        $data->setName = $request->user->name;
        return json_encode($this->userRepository->SetKpi($data));
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/user/kpiList",
     *     tags={"门店管理系统-人员管理"},
     *     summary="人员目标列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="月份", property="month", type="number", default="10"),
     *           @OA\Property(description="条数", property="pageSize", type="number", default="10"),
     *           @OA\Property(description="页数", property="page", type="number", default="1"),
     *           @OA\Property(description="关键字", property="searchKey", type="string", default=""),
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
    public function GetKpiList(Request $request)
    {
        $rules = [
            'month' => ['nullable', 'date_format:"Y-m"'],
            'searchKey' => ['nullable', 'string'],
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
            $data->storeId = $request->user->storeId;
            $takeNum = isset($data->pageSize) ? $data->pageSize : 10;
            $page = isset($data->page) ? $data->page : 1;
            $skipNum = ($page - 1) * $takeNum;
            $users = $this->userRepository->GetKpiList($data);
            $total = $users->count();
            $list = $users->skip($skipNum)->take($takeNum)->get();
            $pageTotal = $total / $takeNum;
            $pageRes = (object) [];
            $pageRes->total = $total;
            $pageRes->pageNo = $page;
            $pageRes->pageSize = $takeNum;
            $pageRes->pages = is_int($pageTotal) ? ($pageTotal) : (floor($pageTotal) + 1);
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '获取列表成功!',
                    'data' => $list,
                    'page' => $pageRes,
                )
            );

        }
    }
}
