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
     *     path="/api/admin/livePet/addOrUpdate",
     *     tags={"总台管理系统-活体管理"},
     *     summary="新增或修改活体",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="活体id", property="lpetId", type="string", default="dd"),
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
     *           required={"typeId","gender","vaccine","number","color","varietyId","originPrice","salePrice","age",shoulderHeight,note,"bgImg","avatar","certificates","detailImgs"})
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
    public function addOrUpdate(Request $request)
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
        return json_encode($this->livePetRepository->AddOrUpdate((object) $request->all()));
    }

}
