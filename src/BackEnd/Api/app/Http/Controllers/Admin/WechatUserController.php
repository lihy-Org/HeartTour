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
     *     path="/api/admin/wechat/list",
     *     tags={"总台管理系统-用户管理"},
     *     summary="用户列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="性别", property="gender", type="string", default=""),
     *           @OA\Property(description="状态 0正常 1禁用", property="state", type="string", default=""),
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
    public function GetList(Request $request)
    {
        $rules = [
            'gender' => [Rule::in([0,1,2])],
            'searchKey' => ['nullable','string'],
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
            $users = $this->wechatUserRepository->GetList($data);
            $total = $users->count();
            $list = $users->skip($skipNum)->take($takeNum)
                ->selectRaw("*")->get();
            $pageTotal = $total / $takeNum;
            $pageRes=(object)[];
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
     *     path="/api/admin/wechat/remove",
     *     tags={"总台管理系统-用户管理"},
     *     summary="禁用/解禁用户",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="userId", type="number", default="10"),
     *           required={"storeId"}
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
        return json_encode($this->wechatUserRepository->Remove($request->userId));
    }

    /**
     * @OA\Get(
     *     path="/api/admin/pet/list",
     *     tags={"总台管理系统-用户管理"},
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
    public function GetPetList(Request $request)
    {
        // ->select('id as petId', 'avatar', 'nickname', 'breed', 'gender')->get()->toArray();
        $pets = $this->petRepository->GetList((object) $request->all())->get();
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取列表成功!',
                'data' => $pets,
            )
        );
    }
}
