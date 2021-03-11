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
     *     path="/api/config/{type}/{key?}",
     *     tags={"小程序-配置管理"},
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
}
