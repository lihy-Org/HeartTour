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
     *           @OA\Property(description="职位", property="post", type="string", default=""),
     *           @OA\Property(description="性别", property="gender", type="string", default=""),
     *           @OA\Property(description="条数", property="pageSize", type="number", default="10"),
     *           @OA\Property(description="页数", property="page", type="number", default="1"),
     *           @OA\Property(description="关键字", property="searchKey", type="string", default=""),
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
            'gender' => ['string'],
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
            $data = $request->all();
            $takeNum = isset($data->pageSize) ? $data->pageSize : 10;
            $page = isset($data->page) ? $data->page : 1;
            $skipNum = ($page - 1) * $takeNum;
            $users = $this->userRepository->GetList((object) $data);
            $total = $users->count();
            $list = $users->skip($skipNum)->take($takeNum)->get();
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
     *           @OA\Property(description="是否技师", property="isWorker", type="number", default="dd"),
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
    public function addOrUpdate(Request $request)
    {
        $rules = [
            'name' => ['required', 'string'],
            'phone' => ['required', 'string', Rule::unique('users')->ignore($request->userId, 'id')],
            'avatar' => ['required', 'string'],
            'gender' => ['required', 'string'],
            'age' => ['required', 'string'],
            'postId' => ['required', 'string'],
            'titleIds' => ['nullable', 'array'],
            'isWorker' => ['nullable', Rule::in(['0', '1'])],
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
     *     path="/api/admin/user/SetStore",
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
                $query->where('state', 0)->whereNotIn('type', [0, 1]);
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
     *     path="/api/admin/user/SetManage",
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
                $query->where('state', 0)->whereNotIn('type', [0, 1])->where('storeId','!=', '')->whereNotNull('storeId');
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
}
