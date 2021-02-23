<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Config;
use App\Repositories\ConfigRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConfigController extends Controller
{
    protected $configRepository;

    public function __construct(ConfigRepository $_configRepository)
    {
        $this->configRepository = $_configRepository;
    }

    /**    
     * @OA\Get(
     *     path="/api/admin/config/{type}/{key?}",
     *     tags={"总台管理系统-配置管理"},
     *     summary="获取配置",  
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\Parameter(name="type", in="query", @OA\Schema(type="string"), required=true, description="类型"),
     *     @OA\Parameter(name="key", in="query", @OA\Schema(type="string"), required=false, description="键"),
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
    public function GetConfig($type, $key = '')
    {
        $rules = [
            'type' => ['required', 'string'],
            'key' => ['string'],
        ];
        $messages = [
            'type.required' => '请输入分类!',
        ];
        $validator = Validator::make(['type' => $type, 'key' => $key], $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '获取失败!',
                'data' => $validator->errors(),
            ));
        } else {
            if ($key != '') {
                return json_encode(
                    array(
                        'status' => 200,
                        'msg' => '获取成功!',
                        'data' => $this->configRepository->GetOne($type, $key)->select('id', 'type', 'key', 'value', 'sort')->first(),
                    )
                );
            } else {               
                return json_encode(
                    array(
                        'status' => 200,
                        'msg' => '获取成功!',
                        'data' => $this->configRepository->GetByType($type)->select('id', 'type', 'key', 'value', 'sort')->get(),
                    )
                );
            }
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
     *           @OA\Property(description="父级ID", property="parentId", type="string", default=""),
     *           @OA\Property(description="是否清空,1则清空所有type下配置", property="delAll", type="number", default="0"),
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
    public function AddOrUpdate(Request $request)
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
        return json_encode($this->configRepository->AddOrUpdate((object) $request->all()));
    }

    /**
     * @OA\Post(
     *     path="/api/admin/config/remove",
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
    public function Remove(Request $request)
    {
        $Config = Config::where('id', $request->configId)->first();
        if ($Config) {
            $Config->delete();
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
