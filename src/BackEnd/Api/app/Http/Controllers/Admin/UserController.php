<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/admin/user/list",
     *     tags={"总台管理系统-用户管理"},
     *     summary="用户列表",
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
    public function userList(Request $request)
    {
        $rules = [
            'storeId' => ['integer'],
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
                'msg' => '登录失败!',
                'data' => $validator->errors(),
            ));
        } else {
            $data = $request->all();
            $takeNum = isset($data['pageSize']) ? $data['pageSize'] : 10;
            $page = isset($data['page']) ? $data['page'] : 1;
            $skipNum = ($page - 1) * $takeNum;
            $users = User::where('state', 0)->where('type', 'in', [2, 3])->orderBy('created_at');
            if (isset($data['searchKey'])) {
                $users = $users->where(function ($query) {
                    $query->where('name', 'like', '%' . $data['searchKey'] . '%')
                        ->orWhere('phone', 'like', '%' . $data['searchKey'] . '%');
                });
            }
            if (isset($data['storeId'])) {
                $users = $users->where('storeId', $data['storeId']);
            }
            if (isset($data['post'])) {
                $users = $users->where('post', $data['post']);
            }
            if (isset($data['gender'])) {
                $users = $users->where('gender', $data['gender']);
            }
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
     *     tags={"总台管理系统-用户管理"},
     *     summary="新增或修改用户信息",
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
     *           @OA\Property(description="职位", property="post", type="string", default="dd"),
     *           @OA\Property(description="头衔", property="title", type="string", default="dd"),
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
            'phone' => ['required', 'string', Rule::unique('users')->ignore($request->name, 'phone')],
            'avatar' => ['required', 'string'],
            'gender' => ['required', 'string'],
            'age' => ['required', 'string'],
            'post' => ['required', 'string'],
            'title' => ['string'],
        ];
        $messages = [
            'name.required' => '请输入用户名称!',
            'phone.required' => '请输入电话!',
            'phone.unique' => '重复的电话号码!',
            'avatar.required' => '请输入头像!',
            'gender.required' => '请输入性别!',
            'age.required' => '请输入年龄!',
            'post.required' => '请输入职位!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '添加信息失败!',
                'data' => $validator->errors(),
            ));
        }
        $user = User::find($request->userId);
        if (!$user) {
            User::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'avatar' => $request->avatar,
                'gender' => $request->gender,
                'age' => $request->age,
                'post' => $request->post,
                'title' => is_null($request->title) || empty($request->title) ? '' : $request->title,
                'type' => 3,
                'state' => 0,
            ]);
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '添加信息成功!',
                    'data' => '',
                )
            );
        } else {
            $user->name = $request->name;
            $user->phone = $request->phone;
            $user->avatar = $request->avatar;
            $user->gender = $request->gender;
            $user->age = $request->age;
            $user->post = $request->post;
            $user->title = is_null($request->title) || empty($request->title) ? '' : $request->title;
            $user->save();
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '修改信息成功!',
                    'data' => '')
            );
        }
    }

     /**
     * @OA\Post(
     *     path="/api/admin/user/remove",
     *     tags={"总台管理系统-用户管理"},
     *     summary="删除用户",
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
    public function remove(Request $request)
    {
        $user = User::where('id', $request->userId)->first();
        if ($user) {
            $user->state = 1;
            $user->save();
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '删除成功!',
                    'data' => '')
            );
        }
        return json_encode(
            array(
                'status' => 500,
                'msg' => '删除失败,找不到该门店!',
                'data' => '')
        );
    }
}
