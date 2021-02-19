<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Repositories\ComboRepository;
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
     *     summary="新增或修改套餐管理",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="套餐id", property="comboId", type="string", default="dd"),
     *           @OA\Property(description="套餐类型：0-主套餐  1-增项套餐", property="comboType", type="string", default="dd"),
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
    public function addOrUpdate(Request $request)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('combos')->ignore($request->comboId, 'id')],
            'comboType' => ['required', Rule::in(['0', '1'])],
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

}
