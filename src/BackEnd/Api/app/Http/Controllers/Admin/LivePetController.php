<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\LivePetRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class LivePetController extends Controller
{
    protected $livePetRepository;

    public function __construct(LivePetRepository $_livePetRepository)
    {
        $this->livePetRepository = $_livePetRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/admin/live/addOrUpdate",
     *     tags={"总台管理系统-活体管理"},
     *     summary="新增或修改活体",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="活体id", property="liveId", type="string", default="dd"),
     *           @OA\Property(description="活体类型Id", property="typeId", type="string", default="dd"),
     *           @OA\Property(description="性别 0未知，1男，2女", property="gender", type="number", default="dd"),
     *           @OA\Property(description="是否疫苗 1-已打疫苗 0-未打疫苗", property="vaccine", type="number", default="dd"),
     *           @OA\Property(description="编号", property="number", type="string", default="dd"),
     *           @OA\Property(description="毛色", property="color", type="string", default="dd"),
     *           @OA\Property(description="品种Id", property="varietyId", type="string", default="dd"),
     *           @OA\Property(description="原价", property="originPrice", type="string", default="dd"),
     *           @OA\Property(description="售价", property="salePrice", type="string", default="dd"),
     *           @OA\Property(description="年龄", property="age", type="number", default="dd"),
     *           @OA\Property(description="肩高", property="shoulderHeight", type="number", default="dd"),
     *           @OA\Property(description="备注", property="note", type="number", default="dd"),
     *           @OA\Property(description="头像", property="avatar", type="number", default="dd"),
     *           @OA\Property(description="证书", property="certificates", type="string", default="dd"),
     *           @OA\Property(description="详情图", property="detailImgs", type="string", default="dd"),
     *           required={"typeId","gender","vaccine","number","color","varietyId","originPrice","salePrice","age","shoulderHeight","note","bgImg","avatar","certificates","detailImgs"})
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
            'typeId' => ['required', Rule::exists('configs', 'id')],
            'gender' => ['required', 'numeric', Rule::in([0, 1, 2])],
            'vaccine' => ['required', 'numeric', Rule::in([0, 1])],
            'number' => ['required', 'string', Rule::unique('livePets')->ignore($request->liveId, 'id')],
            'color' => ['required', 'string'],
            'varietyId' => ['required', Rule::exists('configs', 'id')],
            'originPrice' => ['numeric', 'required'],
            'salePrice' => ['numeric', 'required'],
            'age' => ['integer', 'required'],
            'shoulderHeight' => ['required', 'integer'],
            'note' => ['required', 'string'],
            'avatar' => ['required', 'string'],
            'detailImgs' => ['required', 'array'],
            'certificates' => ['required', 'array'],
        ];
        $validator = Validator::make($request->all(), $rules, []);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        return json_encode($this->livePetRepository->AddOrUpdate((object) $request->all()));
    }

    /**
     * @OA\Post(
     *     path="/api/admin/live/remove",
     *     tags={"总台管理系统-活体管理"},
     *     summary="活体上下架",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="活体编号", property="liveId", type="number", default="10"),
     *           required={"liveId"}
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
        return json_encode($this->livePetRepository->Remove($request->liveId));
    }

    /**
     * @OA\Post(
     *     path="/api/admin/live/remove",
     *     tags={"总台管理系统-活体管理"},
     *     summary="活体列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="活体类型编号", property="typeId", type="string", default=""),
     *           @OA\Property(description="品种Id", property="varietyId", type="string", default=""),
     *           @OA\Property(description="关键字", property="searchKey", type="string", default=""),
     *           @OA\Property(description="上架状态 0-待上架 1-已上架 2-已下架，3-已售", property="state", type="string", default=""),
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
            'typeId' => ['nullable', Rule::exists('configs', 'id')],
            'varietyId' => ['nullable', Rule::exists('configs', 'id')],
            'state' => [Rule::in([0, 1, 2, 3])],
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
            $lives = $this->livePetRepository->GetList($data);
            $total = $lives->count();
            $list = $lives->skip($skipNum)->take($takeNum)->get();
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
