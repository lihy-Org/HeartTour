<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConfigController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/admin/config/{type}",
     *     tags={"总台管理系统-配置管理"},
     *     summary="获取配置列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\Parameter(name="type", in="query", @OA\Schema(type="string"), required=true, description="分类"),
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
     *                  example="{'type':['\u8bf7\u8f93\u5165\u5355\u4f4d\u540d\u79f0\uff01']}",
     *              )
     *         )
     *     )
     * )
     */
    function list($type) {        
        $rules = [
            'type' => ['required', 'string'],
        ];
        $messages = [
            'type.required' => '请输入分类!',
        ];
        $validator = Validator::make(['type'=>$type], $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '获取列表失败!',
                'data' => $validator->errors(),
            ));
        } else {
            $settings = Setting::where('type', $type)->select('id','type', 'key', 'value', 'sort')->orderBy('sort')->get();
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '获取列表成功!',
                    'data' => $settings,
                )
            );
        }
    }

    /**
     * @OA\Get(
     *     path="/api/admin/config/{type}/{key}",
     *     tags={"总台管理系统-配置管理"},
     *     summary="获取单个配置",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\Parameter(name="key", in="query", @OA\Schema(type="string"), required=true, description="键"),
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
    public function getOne($type,$key)
    {
        $rules = [
            'type' => ['required', 'string'],
            'key' => ['required', 'string'],
        ];
        $messages = [
            'type.required' => '请输入分类!',
            'type.required' => '请输入配置键!',
        ];
        $validator = Validator::make(['type'=>$type,'key'=>$key], $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '获取失败!',
                'data' => $validator->errors(),
            ));
        } else {
            $setting = Setting::where('type', $type)->where('key', $key)->select('id','type', 'key', 'value', 'sort')->orderBy('sort')->first();
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '获取成功!',
                    'data' => $setting,
                )
            );
        }
    }

    /**
     * @OA\Post(
     *     path="/api/admin/config/addOrUpdate",
     *     tags={"总台管理系统-配置管理"},
     *     summary="添加或修改配置",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="配置id", property="configId", type="string", default=""),
     *           @OA\Property(description="分类", property="type", type="string", default=""),
     *           @OA\Property(description="配置键", property="key", type="string", default=""),
     *           @OA\Property(description="配置值", property="value", type="string", default=""),
     *           @OA\Property(description="排序", property="sort", type="string", default=""),
     *           required={"type","key","value"})
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
     *                   example="登录成功!",
     *                   property="msg",
     *                   description="提示信息",
     *                   type="string",
     *              ),
     *            @OA\Property(
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
     *               ),
     *          @OA\Property(
     *                  type="string",
     *                  property="msg",
     *                  description="提示信息",
     *                  example="登录失败!",
     *              ),
     *          @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="错误信息",
     *              )
     *         )
     *     )
     * )
     */
    public function addOrUpdate(Request $request)
    {
        $rules = [
            'type' => ['required', 'string'],
            'key' => ['required', 'string'],
            'value' => ['required', 'string'],
            'sort' => ['int'],

        ];
        $messages = [
            'type.required' => '请输入分类!',
            'key.required' => '配置键!',
            'value.required' => '配置值!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '添加失败!',
                'data' => $validator->errors(),
            ));
        }
        $setting = Setting::find($request->configId);
        if (!$setting) {
            if (Setting::where('type', $request->type)->where('key', $request->key)->first()) {
                return json_encode(
                    array(
                        'status' => 500,
                        'msg' => '重复配置!',
                        'data' => '',
                    )
                );
            }
            Setting::create([
                'type' => $request->type,
                'key' => $request->key,
                'value' => $request->value,
                'sort' => is_null($request->sort) || empty($request->sort) ? 1 : $request->sort,
            ]);
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '添加成功!',
                    'data' => '',
                )
            );
        } else {
            $setting->value = $request->value;
            $setting->save();
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '修改成功!',
                    'data' => '')
            );
        }
    }

    /**
     * @OA\Post(
     *     path="/api/admin/config/delete",
     *     tags={"总台管理系统-配置管理"},
     *     summary="删除配置",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="配置id", property="configId", type="string", default=""),
     *           required={"configId"})
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
     *                   example="登录成功!",
     *                   property="msg",
     *                   description="提示信息",
     *                   type="string",
     *              ),
     *            @OA\Property(
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
     *               ),
     *          @OA\Property(
     *                  type="string",
     *                  property="msg",
     *                  description="提示信息",
     *                  example="登录失败!",
     *              ),
     *          @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="错误信息",
     *              )
     *         )
     *     )
     * )
     */
    public function delete(Request $request)
    {
        $setting = Setting::where('id', $request->configId)->first();
        if ($setting) {
            $setting->delete();
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
                'msg' => '删除失败,找不到该配置!',
                'data' => '')
        );
    }

}
