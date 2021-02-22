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
     *           @OA\Property(description="0-已预约 1-进行中 2-待接取 3-已完成", property="state", type="string", default=""),
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
            'storeId' => ['required', Rule::exists('stores', 'id')],
            'startDate' => ['date_format:"Y-m-d H:i:s"'],
            'endDate' => ['date_format:"Y-m-d H:i:s"'],
            'state' => [Rule::in(['0', '1', '2', '3'])],
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
            $data->storeId = $request->user->storeId;
            $takeNum = isset($data->pageSize) ? $data->pageSize : 10;
            $page = isset($data->page) ? $data->page : 1;
            $skipNum = ($page - 1) * $takeNum;
            $appts = $this->appointmentRepository->GetList($data);
            $total = $appts->count();
            $list = $appts->skip($skipNum)->take($takeNum)->get();
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

}
