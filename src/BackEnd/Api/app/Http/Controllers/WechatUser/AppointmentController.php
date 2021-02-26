<?php

namespace App\Http\Controllers\WechatUser;

use App\Http\Controllers\Controller;
use App\Models\User;
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
     *           @OA\Property(description="门店ID", property="storeId", type="string", default="dd"),
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
            'workDay' => ['required', 'date_format:"Y-m-d"', 'after_or_equal:today'],
            'workTime' => ['required', 'date_format:"H:i"'],
            'petId' => ['required', Rule::exists('pets', 'id')->where(function ($query) use ($request) {
                $query->where('wcid', $request->user->id);
            })],
            'storeId' => ['required', Rule::exists('stores', 'id')->where(function ($query) {
                $query->where('state', 0);
            })],
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) use ($request) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1)->where('storeId', $request->storeId);
            })],
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
        $data->wcId = $request->user->id;
        return json_encode($this->appointmentRepository->Appointment($data));
    }

    /**
     * @OA\Post(
     *     path="/api/appt/getWorkTime",
     *     tags={"小程序-预约"},
     *     summary="人员排班表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="门店编号", property="storeId", type="number", default="13888888888"),     *
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
        return json_encode($this->appointmentRepository->GetWorktime($data)->get());
    }
}
