<?php

namespace App\Http\Controllers\StoreSystem;

use App\Http\Controllers\Controller;
use App\Repositories\AppointmentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    protected $appointmentRepository;

    public function __construct(AppointmentRepository $_appointmentRepository)
    {
        $this->appointmentRepository = $_appointmentRepository;
    }
    /**
     * @OA\Post(
     *     path="/api/storesys/appt/list",
     *     tags={"门店管理系统-预约管理"},
     *     summary="预约列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="状态", property="state", type="string", default=""),
     *           @OA\Property(description="人员编号", property="userId", type="string", default=""),
     *           @OA\Property(description="是否加单 不填全部 0为线上预约  1为线下加单", property="isOffline", type="number", default=""),
     *           @OA\Property(description="小程序用户编号", property="wcId", type="string", default=""),
     *           @OA\Property(description="预约开始时间", property="startDate", type="string", default=""),
     *           @OA\Property(description="预约结束时间", property="endDate", type="string", default=""),
     *           @OA\Property(description="条数", property="pageSize", type="number", default="10"),
     *           @OA\Property(description="页数", property="page", type="number", default="1"),
     *           @OA\Property(description="关键字", property="searchKey", type="string", default=""),
     *           required={"state"})
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
            'startDate' => ['date_format:"Y-m-d H:i:s"'],
            'endDate' => ['date_format:"Y-m-d H:i:s"'],
            'isOffline' => ['nullable', Rule::in([0, 1])],
            'state' => [Rule::in([100, 200, 300, 400, 500, 501, 502, 600, 601])],
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
            $appts = $this->appointmentRepository->GetList($data);
            $total = $appts->count();
            $list = $appts->skip($skipNum)->take($takeNum)->get();
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
     *     path="/api/storesys/appt/getWorktime",
     *     tags={"门店管理系统-预约管理"},
     *     summary="人员排班表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="日期", property="workDay", type="string", default=""),
     *           @OA\Property(description="开始时间", property="startDate", type="string", default=""),
     *           @OA\Property(description="结束时间", property="endDate", type="string", default=""),
     *           @OA\Property(description="时间", property="workTime", type="string", default=""),
     *           @OA\Property(description="用户编号", property="userId", type="string", default="")
     *          )
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
    public function GetWorktime(Request $request)
    {
        $rules = [
            'startDate' => ['nullable', 'date_format:"Y-m-d"'],
            'endDate' => ['nullable', 'date_format:"Y-m-d"'],
            'workDay' => ['nullable', 'date_format:"Y-m-d"', 'after_or_equal:today'],
            'workTime' => ['nullable', 'date_format:"H:i"'],
            'userId' => ['nullable', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->storeId);
            })],
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
        $data->storeId = $request->user->storeId;
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取列表成功!',
                'data' => $this->appointmentRepository->GetWorktime($data)->get(),
            )
        );
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/appt/getStatsWorktime",
     *     tags={"门店管理系统-预约管理"},
     *     summary="人员排班总表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="日期", property="workDay", type="string", default=""),
     *           @OA\Property(description="开始时间", property="startDate", type="string", default=""),
     *           @OA\Property(description="结束时间", property="endDate", type="string", default=""),
     *           @OA\Property(description="用户编号", property="userId", type="string", default="")
     *          )
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
    public function getStatsWorktime(Request $request)
    {
        $rules = [
            'startDate' => ['nullable', 'date_format:"Y-m-d"'],
            'endDate' => ['nullable', 'date_format:"Y-m-d"'],
            'workDay' => ['nullable', 'date_format:"Y-m-d"', 'after_or_equal:today'],
            'userId' => ['nullable', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->storeId);
            })],
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
        $data->storeId = $request->user->storeId;
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取列表成功!',
                'data' => $this->appointmentRepository->getStatsWorktime($data)->get(),
            )
        );
    }
    /**
     * @OA\Post(
     *     path="/api/storesys/appt/trans",
     *     tags={"门店管理系统-预约管理"},
     *     summary="修改预约信息",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="套餐编号", property="orderId", type="string", default="dd"),
     *           @OA\Property(description="预约日期 2020-01-01", property="workDay", type="string", default="dd"),
     *           @OA\Property(description="预约时间 9:00 必须是规定的整点", property="workTime", type="string", default="dd"),
     *           @OA\Property(description="技师ID", property="userId", type="string", default="dd"),
     *           @OA\Property(description="辅助技师ID", property="slaveUserId", type="string", default="dd"),     * 
     *           required={"comboIds","workDay","workTime","petId","userId","storeId"})
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
    public function TransferAppt(Request $request)
    {
        $rules = [            
            'workDay' => ['required', 'date_format:"Y-m-d"', 'after_or_equal:today'],
            'workTime' => ['required', 'date_format:"H:i"'],
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->user->storeId);
            })],
            'slaveUserId' => ['nullable', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->user->storeId);
            })],  
            'orderId' => ['required', Rule::exists('orders', 'id')->where(function ($query) use ($request) {
                $query->where('state', 200)->where('storeId', $request->user->storeId);
            })],
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
        return json_encode($this->appointmentRepository->TransferAppt($data));
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/appt/changeState",
     *     tags={"门店管理系统-预约管理"},
     *     summary="待接取订单客户不点击完成时门店点击完成",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="套餐编号", property="orderId", type="string", default="dd"),
     *           required={"orderId","state"})
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
    public function ChangeState(Request $request)
    {
        $rules = [
            'orderId' => ['required', Rule::exists('orders', 'id')->where(function ($query) use ($request) {
                $query->where('state', '400')->where('storeId', $request->user->soc);
            })],
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
        $data->state = 500;
        return json_encode($this->appointmentRepository->ChangeState($data));
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/appt/refund",
     *     tags={"门店管理系统-预约管理"},
     *     summary="退款",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="订单编号", property="orderId", type="string", default="dd"),
     *           @OA\Property(description="退款理由", property="reason", type="string", default="dd"),
     *           @OA\Property(description="图片凭证", property="images", type="string", default="dd"),
     *           required={"orderId","reason"})
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
    public function Refund(Request $request)
    {
        $rules = [
            'orderId' => ['required', Rule::exists('orders', 'id')->where(function ($query) use ($request) {
                $query->where('storeId', $request->user->storeId)->where('type', 1)->where('state', 200);
            })],
            'reason' => ['required', 'string'],
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
        $data->userName = $request->user->name;
        return json_encode($this->appointmentRepository->Refund($data));
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/appt/addRemark",
     *     tags={"门店管理系统-预约管理"},
     *     summary="门店预约单备注",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="套餐编号", property="orderId", type="string", default="dd"),
     *           @OA\Property(description="店长备注", property="storeRemark", type="string", default="dd"),
     *           required={"orderId","state","userRemark"})
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
    public function AddStoreRemark(Request $request)
    {
        $rules = [
            'storeRemark' => ['required', 'string'],
            'orderId' => ['required', Rule::exists('orders', 'id')->where(function ($query) use ($request) {
                $query->where('userId', $request->user->id);
            })],
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
        return json_encode($this->appointmentRepository->AddStoreRemark($data));
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/appt/offlineAppt",
     *     tags={"门店管理系统-预约管理"},
     *     summary="插单",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="订单编号", property="orderId", type="string", default="dd"),
     *           @OA\Property(description="套餐编号", property="comboIds", type="string", default="dd"),
     *           @OA\Property(description="小程序用户编号", property="wcId", type="string", default="dd"),
     *           @OA\Property(description="小程序用户昵称", property="wcNickname", type="string", default="dd"),
     *           @OA\Property(description="小程序用户头像", property="wcAvatar", type="string", default="dd"),
     *           @OA\Property(description="小程序用户性别", property="wcGender", type="number", default="dd"),
     *           @OA\Property(description="小程序用户省", property="province", type="string", default="dd"),
     *           @OA\Property(description="小程序用户市", property="city", type="string", default="dd"),
     *           @OA\Property(description="小程序用户区", property="country", type="string", default="dd"),
     *           @OA\Property(description="小程序用户地址", property="address", type="string", default="dd"),
     *           @OA\Property(description="小程序用户手机", property="phone", type="string", default="dd"),
     *           @OA\Property(description="预约宠物id", property="petId", type="string", default="dd"),
     *           @OA\Property(description="预约宠物头像", property="petAvatar", type="string", default="dd"),
     *           @OA\Property(description="预约宠物昵称", property="petNickname", type="string", default="dd"),
     *           @OA\Property(description="预约宠物性别", property="petGender", type="string", default="dd"),
     *           @OA\Property(description="预约宠物品种", property="petVarietyId", type="string", default="dd"),
     *           @OA\Property(description="预约宠物生日", property="birthday", type="string", default="dd"),
     *           @OA\Property(description="预约宠物肩高", property="shoulderHeight", type="string", default="dd"),
     *           @OA\Property(description="预约宠物备注", property="petRemark", type="string", default="dd"),
     *           @OA\Property(description="预约宠物颜色", property="color", type="string", default="dd"),
     *           @OA\Property(description="技师ID", property="userId", type="string", default="dd"),
     *           @OA\Property(description="辅助技师ID", property="slaveUserId", type="string", default="dd"),
     *           @OA\Property(description="套餐总额", property="totalMoney", type="number", default="dd"),
     *           @OA\Property(description="备注", property="remark", type="string", default="dd"),
     *           required={"comboIds","userId","storeId"})
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
    public function OfflineAppt(Request $request)
    {
        $rules = [
            'orderId' => ['nullable', Rule::exists('orders', 'id')->where(function ($query) use ($request) {
                $query->where('isOffline', 1);
            })],
            'wcId' => ['nullable', Rule::exists('wechatuser', 'id')],
            'wcNickname' => ['required_without:wcId', 'string'],
            'wcAvatar' => ['string'],
            'wcGender' => ['required_without:wcId', Rule::in([0, 1, 2])],
            'province' => ['string'],
            'city' => ['string'],
            'country' => ['string'],
            'address' => ['string'],
            'phone' => ['required_without:wcId', 'regex:/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$/', Rule::unique('wechatuser')->ignore($request->phone, 'phone')],

            'petId' => ['nullable', Rule::exists('pets', 'id')->where(function ($query) use ($request) {
                $query->where('wcId', $request->wcId);
            })],
            'petAvatar' => ['string'],
            'petNickname' => ['required_without:petId', 'string'],
            'petGender' => ['required_without:petId', Rule::in([0, 1, 2])],
            'petVarietyId' => ['required_without:petId', Rule::exists('configs', 'id')],
            'birthday' => ['string'],
            'color' => ['string'],
            'shoulderHeight' => ['string', 'integer', 'gt:0'],
            'petRemark' => ['string'],

            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->user->storeId);
            })],
            'slaveUserId' => ['nullable', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->user->storeId);
            })],            
            'totalMoney' => ['required', 'numeric'],
            'comboIds' => ['required', 'array', Rule::exists('combos', 'id')->where(function ($query) {
                $query->where('state', 0);
            })],
            'comboIds.*' => ['distinct'],
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
        $data->storeId = $request->user->storeId;
        return json_encode($this->appointmentRepository->OfflineAppt($data));
    }

}
