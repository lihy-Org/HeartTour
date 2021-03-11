<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\ComboRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ComboController extends Controller
{
    protected $comboRepository;

    public function __construct(ComboRepository $_comboRepository)
    {
        $this->comboRepository = $_comboRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/admin/combo/addOrUpdate",
     *     tags={"总台管理系统-套餐管理"},
     *     summary="新增或修改套餐",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="套餐id", property="comboId", type="string", default="dd"),
     *           @OA\Property(description="套餐类型：0-主套餐  1-增项套餐", property="comboType", type="string", default="dd"),
     *           @OA\Property(description="套餐描述", property="desc", type="string", default="dd"),
     *           @OA\Property(description="适用品种", property="varietyIds", type="string", default="dd"),
     *           @OA\Property(description="名称", property="name", type="string", default="dd"),
     *           @OA\Property(description="原价", property="originPrice", type="string", default="dd"),
     *           @OA\Property(description="售价", property="salePrice", type="string", default="dd"),
     *           @OA\Property(description="护理时长", property="nursingTime", type="string", default="dd"),
     *           @OA\Property(description="背景图", property="bgImg", type="string", default="dd"),
     *           @OA\Property(description="轮播图", property="bannerImgs", type="string", default="dd"),
     *           @OA\Property(description="详情图", property="detailImgs", type="string", default="dd"),
     *           required={"comboType","varietyIds","name","originPrice","salePrice","nursingTime","bgImg","bannerImgs","detailImgs"})
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
     *                  example="新增/修改信息成功!",
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
     *                  example="修改失败!",
     *               ),
     *          @OA\Property(
     *                 type="object",
     *                 property="data",
     *                 example="错误信息",
     *              )
     *         )
     *     )
     * )
     */
    public function AddOrUpdate(Request $request)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('combos')->ignore($request->comboId, 'id')],
            'comboType' => ['required', Rule::in([0, 1])],
            'desc' => ['required', 'string'],
            'originPrice' => ['numeric', 'required'],
            'salePrice' => ['numeric', 'required'],
            'nursingTime' => ['integer', 'required'],
            'bgImg' => ['required', 'string'],
            'bannerImgs' => ['required', 'array'],
            'detailImgs' => ['required', 'array'],
            'varietyIds' => ['required', 'array'],
        ];
        $validator = Validator::make($request->all(), $rules, []);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        return json_encode($this->comboRepository->AddOrUpdate((object) $request->all()));
    }
    /**
     * @OA\Post(
     *     path="/api/admin/combo/remove",
     *     tags={"总台管理系统-套餐管理"},
     *     summary="套餐上下架",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="comboId", type="number", default="10"),
     *           required={"comboId"}
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
     *                  example="禁用/启用成功!",
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
     *                  example="禁用/启用失败!",
     *               )
     *           )
     *       ),
     * )
     */
    public function Remove(Request $request)
    {
        return json_encode($this->comboRepository->Remove($request->comboId));
    }

    /**
     * @OA\Post(
     *     path="/api/admin/combo/SetBeautician",
     *     tags={"总台管理系统-套餐管理"},
     *     summary="分配人员",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="套餐ID", property="comboId", type="number", default="10"),
     *           @OA\Property(description="门店ID", property="userIds", type="number", default="10"),
     *           required={"userIds","comboId"}
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
    public function SetBeautician(Request $request)
    {
        $rules = [
            'userIds' => ['required', 'array', Rule::exists('users', 'id')->where(function ($query) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('isBeautician', 1);
            })],
            'comboId' => ['required', Rule::exists('combos', 'id')->where(function ($query) {
                $query->where('comboType', 0);
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
        return json_encode($this->comboRepository->SetBeautician((object) $request->all()));
    }

    /**
     * @OA\Post(
     *     path="/api/admin/combo/list",
     *     tags={"总台管理系统-套餐管理"},
     *     summary="套餐列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="门店编号", property="storeId", type="string", default=""),
     *           @OA\Property(description="宠物品种编号", property="varietyId", type="string", default=""),
     *           @OA\Property(description="关键字", property="searchKey", type="string", default=""),
     *           @OA\Property(description="套餐类型：0-主套餐  1-增项套餐", property="comboType", type="string", default=""),
     *           @OA\Property(description="上架状态 0-待上架 1-已上架 2-已下架", property="state", type="string", default=""),
     *           @OA\Property(description="条数", property="pageSize", type="number", default="10"),
     *           @OA\Property(description="页数", property="page", type="number", default="1"),     *
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
            'storeId' => ['exists:stores,id', 'nullable'],
            'varietyId' => ['nullable'],
            'comboType' => ['nullable', Rule::in([0, 1])],
            'state' => ['nullable', Rule::in([0, 1, 2])],
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
            $takeNum = isset($data->pageSize) ? $data->pageSize : 10;
            $page = isset($data->page) ? $data->page : 1;
            $skipNum = ($page - 1) * $takeNum;
            $combos = $this->comboRepository->GetList($data);
            $total = $combos->count();
            $list = $combos->skip($skipNum)->take($takeNum)->get();
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
