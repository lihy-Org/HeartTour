<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\PetRepository;
use App\Repositories\WechatUserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class WechatUserController extends Controller
{
    protected $wechatUserRepository;
    protected $petRepository;

    public function __construct(WechatUserRepository $_wechatUserRepository, PetRepository $_petRepository)
    {
        $this->wechatUserRepository = $_wechatUserRepository;
        $this->petRepository = $_petRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/storesys/wechat/list",
     *     tags={"门店管理系统-用户管理"},
     *     summary="用户列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="性别", property="gender", type="string", default=""),
     *           @OA\Property(description="状态 0正常 1禁用", property="state", type="string", default=""),
     *           @OA\Property(description="手机", property="phone", type="string", default=""),
     *           @OA\Property(description="累计消费 升序-ascend   降序-descend", property="consumesSort", type="string", default=""),
     *           @OA\Property(description="预约次数  升序-ascend   降序-descend", property="aptTimesSort", type="string", default=""),
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


     /**
     * @OA\Get(
     *     path="/api/storesys/pet/list",
     *     tags={"门店管理系统-用户管理"},
     *     summary="获取宠物列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\Parameter(name="wcId", in="query", @OA\Schema(type="string"), required=false, description="用户id"),
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
     *                  example="获取宠物列表成功!",
     *              ),
     *            @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="[{'id':1,'avatar':'11','nickname':'11','breed':'11','gender':'11'}]",
     *              )
     *         ),
     *    )
     * )
     */
}
