<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Repositories\StoreRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StoreController extends Controller
{
    protected $storeRepository;

    public function __construct(StoreRepository $_storeRepository)
    {
        $this->storeRepository = $_storeRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/admin/store/list",
     *     tags={"总台管理系统-门店管理"},
     *     summary="门店列表",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="条数", property="pageSize", type="number", default="10"),
     *           @OA\Property(description="页数", property="page", type="number", default="1"),
     *           @OA\Property(description="关键字", property="searchKey", type="string", default=""),
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
     *                   example="获取列表成功!",
     *                   property="msg",
     *                   description="提示信息",
     *                   type="string",
     *              ),
     *             @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="{'status':200,'msg':'\u83b7\u53d6\u5217\u8868\u6210\u529f!','data':{'pages':{'total':1,'pageNo':'1'},'data':[{'id':'1','name':'\u6328\u6253\u4e86','phone':'1','lng':'111','lat':'1','address':'1','businessHoursStart':'1','businessHoursEnd':'1','type':1,'state':0,'deleted_at':null,'created_at':null,'updated_at':null},{'id':'xxx','name':'\u597d\u5389\u5bb3\u54e6','phone':'1','lng':'2','lat':'2','address':'2','businessHoursStart':'2','businessHoursEnd':'2','type':1,'state':0,'deleted_at':null,'created_at':null,'updated_at':null},{'id':'\u5fb7\u74e6\u8fbe','name':'ddx\u738b\u60f3\u6328\u6253\u00b7','phone':'1','lng':'2','lat':'1','address':'11','businessHoursStart':'1','businessHoursEnd':'11','type':1,'state':0,'deleted_at':null,'created_at':null,'updated_at':null}]}}",
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
            'pageSize' => ['integer', 'gt:0'],
            'page' => ['integer', 'gt:0'],
            'searchKey' => ['nullable','string'],
        ];
        $messages = [
            'page.integer' => '页码格式错误!',
            'page.gt' => '页码必须大于0!',
            'pageSize.integer' => '每页条数格式错误!',
            'pageSize.gt' => '每页条数必须大于0!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '获取列表失败!',
                'data' => $validator->errors(),
            ));
        } else {
            $data = (object) $request->all();
            $takeNum = isset($data->pageSize) ? $data->pageSize : 10;
            $page = isset($data->page) ? $data->page : 1;
            $skipNum = ($page - 1) * $takeNum;
            $store = $this->storeRepository->GetList($data);
            $total = $store->count();
            $list = $store->skip($skipNum)->take($takeNum)->get();
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
     *     path="/api/admin/store/addOrUpdate",
     *     tags={"总台管理系统-门店管理"},
     *     summary="新增或修改门店信息",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="门店id", property="storeId", type="string", default="dd"),
     *           @OA\Property(description="名称", property="name", type="string", default="dd"),
     *           @OA\Property(description="联系方式", property="phone", type="string", default="dd"),
     *           @OA\Property(description="经度", property="lng", type="string", default="dd"),
     *           @OA\Property(description="纬度", property="lat", type="string", default="dd"),
     *           @OA\Property(description="地址", property="address", type="string", default="dd"),
     *           @OA\Property(description="起始营业时间", property="businessHourStart", type="string", default="dd"),
     *           @OA\Property(description="结束营业时间", property="businessHourEnd", type="string", default="dd"),
     *           @OA\Property(description="类型1分店，2总店", property="type", type="string", default="dd"),
     *           required={"name","address","lng","lat","businessHourStart","businessHourEnd"})
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
            'phone' => ['required', 'string'],
            'lng' => ['required', 'string'],
            'lat' => ['required', 'string'],
            'address' => ['required', 'string'],
            'businessHourStart' => ['required', 'string','date_format:"H:i"'],
            'businessHourEnd' => ['required', 'string','date_format:"H:i"'],
        ];
        $messages = [
            'name.required' => '请输入门店名称!',
            'phone.required' => '请输入电话号码!',
            'lng.required' => '请输入经度!',
            'lat.required' => '请输入纬度!',
            'address.required' => '请输入地址!',
            'businessHourStart.required' => '请输入起始营业时间!',
            'businessHourEnd.required' => '请输入结束营业时间!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '添加信息失败!',
                'data' => $validator->errors(),
            ));
        }
        return json_encode($this->storeRepository->AddOrUpdate((object) $request->all()));
    }
    /**
     * @OA\Post(
     *     path="/api/admin/store/remove",
     *     tags={"总台管理系统-门店管理"},
     *     summary="禁用启用门店",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="门店ID", property="storeId", type="number", default="10"),
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
        $store = Store::where('id', $request->storeId)->first();
        if ($store) {
            $store->state = $store->state == 0 ? 1 : 0;
            $store->save();
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '禁用/启用成功!',
                    'data' => '')
            );
        }
        return json_encode(
            array(
                'status' => 500,
                'msg' => '禁用/启用失败,找不到该门店!',
                'data' => '')
        );
    }

    /**
     * @OA\Get(
     *     path="/api/admin/store/getSelectList",
     *     tags={"总台管理系统-门店管理"},
     *     summary="门店选择列表",
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
                'data' => $this->storeRepository->GetSelectList()->get(),
            )
        );
    }
}
