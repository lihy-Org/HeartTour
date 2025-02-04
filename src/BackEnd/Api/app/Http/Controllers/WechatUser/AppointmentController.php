<?php

namespace App\Http\Controllers\WechatUser;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\AppointmentRepository;
use App\Repositories\PayRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    protected $appointmentRepository;
    protected $payRepository;

    public function __construct(AppointmentRepository $_appointmentRepository, PayRepository $_payRepository)
    {
        $this->appointmentRepository = $_appointmentRepository;
        $this->payRepository = $_payRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/appt/add",
     *     tags={"小程序-预约"},
     *     summary="预约",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="套餐编号", property="comboIds", type="string", default="dd"),
     *           @OA\Property(description="预约日期 2020-01-01", property="workDay", type="string", default="dd"),
     *           @OA\Property(description="预约时间 9:00 必须是规定的整点", property="workTime", type="string", default="dd"),
     *           @OA\Property(description="预约宠物id", property="petId", type="string", default="dd"),
     *           @OA\Property(description="技师ID", property="userId", type="string", default="dd"),
     *           @OA\Property(description="套餐总额", property="totalMoney", type="number", default="dd"),
     *           @OA\Property(description="门店ID", property="storeId", type="string", default="dd"),
     *           @OA\Property(description="备注", property="remark", type="string", default="dd"),
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
    public function Appointment(Request $request)
    {
        $rules = [
            'totalMoney' => ['required', 'numeric'],
            'workDay' => ['required', 'date_format:"Y-m-d"', 'after_or_equal:today'],
            'workTime' => ['required', 'date_format:"H:i"'],
            'petId' => ['required', Rule::exists('pets', 'id')->where(function ($query) use ($request) {
                $query->where('wcId', $request->user->id);
            })],
            'storeId' => ['required', Rule::exists('stores', 'id')->where(function ($query) {
                $query->where('state', 0);
            })],
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->storeId);
            })],
            'comboIds' => ['required', 'array', Rule::exists('combos', 'id')->where(function ($query) {
                $query->where('state', 1);
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
        $data->wcId = $request->user->id;
        return json_encode($this->appointmentRepository->Appointment($data));
    }

    /**
     * @OA\Post(
     *     path="/api/appt/getWorktime",
     *     tags={"小程序-预约"},
     *     summary="人员排班表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="门店编号", property="storeId", type="number", default="13888888888"),
     *           @OA\Property(description="日期", property="workDay", type="string", default=""),
     *           @OA\Property(description="用户编号", property="userId", type="string", default=""),
     *           required={"storeId"})
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
            'storeId' => ['required', Rule::exists('stores', 'id')->where(function ($query) {
                $query->where('state', 0);
            })],
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
     *     path="/api/appt/pay",
     *     tags={"小程序-预约"},
     *     summary="准备付款",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="订单编号", property="orderId", type="string", default="dd"),     *
     *           required={"orderId"})
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
    public function Pay(Request $request)
    {
        $rules = [
            'orderId' => ['required', Rule::exists('stores', 'id')->where(function ($query) use ($request) {
                $query->where('wcId', $request->user->id)->where('type', 1)->where('state', 100);
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
        return json_encode($this->PayRepository->Pay($data));
    }

    /**
     * @OA\Post(
     *     path="/api/appt/paid",
     *     tags={"小程序-预约"},
     *     summary="付款后更新状态",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="订单编号", property="orderId", type="string", default="dd"),     *
     *           required={"orderId"})
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
    public function Paid(Request $request)
    {
        $rules = [
            'orderId' => ['required', Rule::exists('stores', 'id')->where(function ($query) use ($request) {
                $query->where('wcId', $request->user->id)->where('type', 1)->where('state', 100);
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
        return json_encode($this->appointmentRepository->Paid($data));
    }

    /**
     * @OA\Post(
     *     path="/api/appt/list",
     *     tags={"小程序-预约"},
     *     summary="预约列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="门店编号", property="storeId", type="string", default="13888888888"),
     *           @OA\Property(description="状态", property="state", type="string", default=""),
     *           @OA\Property(description="是否加单 不填全部 0为线上预约  1为线下加单", property="isOffline", type="number", default=""),
     *           @OA\Property(description="人员编号", property="userId", type="string", default=""),
     *           @OA\Property(description="预约开始时间", property="startDate", type="string", default=""),
     *           @OA\Property(description="预约结束时间", property="endDate", type="string", default=""),
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
            'storeId' => [Rule::exists('stores', 'id')],
            'startDate' => ['date_format:"Y-m-d H:i:s"'],
            'isOffline' => ['nullable', Rule::in([0, 1])],
            'endDate' => ['date_format:"Y-m-d H:i:s"'],
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
            $data->wcId = $request->user->id;
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
     *     path="/api/appt/refund",
     *     tags={"小程序-预约"},
     *     summary="退款",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="订单编号", property="orderId", type="string", default="dd"),
     *           @OA\Property(description="退款理由编号", property="reasonId", type="string", default="dd"),
     *           @OA\Property(description="图片凭证", property="images", type="string", default="dd"),
     *           required={"orderId","reasonId"})
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
            'reasonId' => ['required', Rule::exists('configs', 'id')],
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
        unset($data->rateId);
        return json_encode($this->appointmentRepository->Refund($data));
    }
}
