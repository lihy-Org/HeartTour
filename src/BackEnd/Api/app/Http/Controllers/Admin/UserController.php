<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $_userRepository)
    {
        $this->userRepository = $_userRepository;
    }
    /**
     * @OA\Post(
     *     path="/api/admin/user/list",
     *     tags={"总台管理系统-人员管理"},
     *     summary="人员列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="门店编号", property="storeId", type="number", default="13888888888"),
     *           @OA\Property(description="职位", property="postId", type="string", default=""),
     *           @OA\Property(description="性别", property="gender", type="string", default=""),
     *           @OA\Property(description="条数", property="pageSize", type="number", default="10"),
     *           @OA\Property(description="页数", property="page", type="number", default="1"),
     *           @OA\Property(description="关键字", property="searchKey", type="string", default=""),
     *           @OA\Property(description="是否角色分配 默认0否 1是", property="isDist", type="number", default=""),
     *           @OA\Property(description="人员类型 3 普通人员 4管理人员 5财务人员", property="type", type="number", default=""),
     *           required={"storeId","post"})
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
            'storeId' => ['uuid'],
            'post' => ['string'],
            'gender' => ['nullable', 'integer', Rule::in([0, 1, 2])],
            'searchKey' => ['nullable', 'string'],
            'pageSize' => ['integer', 'gt:0'],
            'page' => ['integer', 'gt:0'],
            'isDist' => ['nullable', 'integer', Rule::in([0, 1])],
            'type' => ['nullable', 'integer', Rule::in([3, 4, 5])],
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
            $users = $this->userRepository->GetList($data);
            $total = $users->count();
            $list = $users->skip($skipNum)->take($takeNum)->get();
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
     *     path="/api/admin/user/addOrUpdate",
     *     tags={"总台管理系统-人员管理"},
     *     summary="新增或修改人员信息",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="userId", type="string", default="dd"),
     *           @OA\Property(description="姓名", property="name", type="string", default="dd"),
     *           @OA\Property(description="电话", property="phone", type="string", default="dd"),
     *           @OA\Property(description="头像", property="avatar", type="string", default="dd"),
     *           @OA\Property(description="性别", property="gender", type="string", default="dd"),
     *           @OA\Property(description="年龄", property="age", type="string", default="dd"),
     *           @OA\Property(description="职位编号", property="postId", type="string", default="dd"),
     *           @OA\Property(description="头衔编号", property="titleIds", type="string", default="dd"),
     *           @OA\Property(description="是否技师", property="isBeautician", type="number", default="dd"),
     *           required={"name","avatar","gender","age","post","phone"})
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
            'name' => ['required', 'string'],
            'phone' => ['required', 'regex:/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$/', 'string', Rule::unique('users')->ignore($request->userId, 'id')],
            'avatar' => ['required', 'string'],
            'gender' => ['required', 'integer', Rule::in([0, 1, 2])],
            'age' => ['required', 'integer', 'gt:0'],
            'postId' => ['required', 'string'],
            'titleIds' => ['nullable', 'array'],
            'isBeautician' => ['nullable', Rule::in([0, 1])],
        ];
        $messages = [
            'name.required' => '请输入用户名称!',
            'phone.required' => '请输入电话!',
            'phone.unique' => '重复的电话号码!',
            'avatar.required' => '请输入头像!',
            'gender.required' => '请输入性别!',
            'age.required' => '请输入年龄!',
            'postId.required' => '请输入职位!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        return json_encode($this->userRepository->AddOrUpdate((object) $request->all()));
    }

    /**
     * @OA\Post(
     *     path="/api/admin/user/remove",
     *     tags={"总台管理系统-人员管理"},
     *     summary="删除人员",
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
        return json_encode($this->userRepository->Remove($request->userId));
    }

    /**
     * @OA\Post(
     *     path="/api/admin/user/setStore",
     *     tags={"总台管理系统-人员管理"},
     *     summary="分配门店",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="userId", type="number", default="10"),
     *           @OA\Property(description="门店ID", property="storeId", type="number", default="10"),
     *           required={"storeId","userId"}
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
    public function SetStore(Request $request)
    {
        $rules = [
            'storeId' => ['required', 'exists:stores,id'],
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                $query->where('state', 0)->whereNotIn('type', [0, 1, 2]);
            }),
            ],
        ];
        $messages = [
            'storeId.required' => '请输入门店编号!',
            'userId.required' => '请输入人员编号!',
            'storeId.exists' => '错误的门店编号!',
            'userId.exists' => '错误的人员编号!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        return json_encode($this->userRepository->SetStore((object) $request->all()));
    }

    /**
     * @OA\Post(
     *     path="/api/admin/user/setManage",
     *     tags={"总台管理系统-人员管理"},
     *     summary="设置店长",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="userId", type="number", default="10"),
     *           required={"userId"}
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
    public function SetManage(Request $request)
    {
        $rules = [
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('storeId', '!=', '')->whereNotNull('storeId');
            })],
        ];
        $messages = [
            'userId.required' => '请输入人员编号!',
            'userId.exists' => '错误的人员编号或该用户还未分配门店!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        return json_encode($this->userRepository->SetStoreManage((object) $request->all()));
    }

    /**
     * @OA\Get(
     *     path="/api/admin/user/getSelectList",
     *     tags={"总台管理系统-人员管理"},
     *     summary="人员选择列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
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
     *                  example="获取成功!",
     *              ),
     *           @OA\Property(
     *                 type="object",
     *                 property="data",
     *                 example="{'status':200,'msg':'\u83b7\u53d6\u6210\u529f!','data':[{'id':'855a4b22-ae76-404b-915b-9b3dcbdc9908','type':'15828242712','key':'1','value':'1','sort':1,'children':[{'id':'9638c2f2-4042-4748-8bbf-42ebdd835b9d','type':'15828242712','key':'44','value':'33','sort':1,'parentId':'855a4b22-ae76-404b-915b-9b3dcbdc9908','children':[]}]},{'id':'a58d75e9-e95f-4eb2-afa5-0f765d8f2a21','type':'15828242712','key':'2','value':'2','sort':1,'children':[]},{'id':'ae9b506b-51d0-4d6a-8ba7-861bf0e06e11','type':'15828242712','key':'11','value':'11','sort':1,'children':[]},{'id':'80270597-e8e9-4f03-9f49-f256063fb5fc','type':'15828242712','key':'22','value':'22','sort':1,'children':[]},{'id':'43287466-0b1b-46de-803d-efa3219814e7','type':'15828242712','key':'33','value':'22','sort':1,'children':[]}]}",
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
     *                  example="获取失败!",
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
    public function GetSelectList(Request $request)
    {
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取列表成功!',
                'data' => $this->userRepository->GetSelectList()->get(),
            )
        );
    }

    /**
     * @OA\Post(
     *     path="/api/admin/user/setType",
     *     tags={"总台管理系统-人员管理"},
     *     summary="角色分配",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="用户ID", property="userId", type="number", default="10"),
     *           @OA\Property(description="角色类型：3普通人员 4总端管理人员 5财务人员", property="type", type="number", default="10"),
     *           required={"userId","type"}
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
    public function SetType(Request $request)
    {
        $rules = [
            'userId' => ['required', Rule::exists('users', 'id')->where(function ($query) {
                $query->where('state', 0)->whereIn('type', [3, 4, 5]);
            })],
            'type' => ['required', Rule::in([3, 4, 5])],
        ];
        $messages = [
            'userId.required' => '请输入人员编号!',
            'userId.exists' => '错误的人员编号或该用户还未分配门店!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '验证失败!',
                'data' => $validator->errors(),
            ));
        }
        return json_encode($this->userRepository->SetType((object) $request->all()));
    }
}
