<?php

namespace App\Http\Controllers\WechatUser;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use App\Repositories\PetRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PetController extends Controller
{
    protected $petRepository;

    public function __construct(PetRepository $_petRepository)
    {
        $this->petRepository = $_petRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/pet/addOrUpdate",
     *     tags={"小程序-宠物"},
     *     summary="新增或修改宠物",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="multipart/form-data",
     *         @OA\Schema(
     *           @OA\Property(description="宠物id", property="petId", type="string", default="dd"),
     *           @OA\Property(description="头像", property="avatar", type="string", default="dd"),
     *           @OA\Property(description="昵称", property="nickname", type="string", default="dd"),
     *           @OA\Property(description="性别", property="gender", type="string", default="dd"),
     *           @OA\Property(description="品种编号", property="varietyId", type="string", default="dd"),
     *           @OA\Property(description="生日", property="birthday", type="string", default="dd"),
     *           @OA\Property(description="毛色", property="color", type="string", default="dd"),
     *           @OA\Property(description="肩高", property="shoulderHeight", type="string", default="dd"),
     *           @OA\Property(description="是否绝育，0：未绝育，1：已绝育", property="is_sterilization", type="int", default="dd"),
     *           @OA\Property(description="备注", property="remark", type="string", default="dd"),
     *           required={"avatar","nickname","gender","varietyId"})
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
     *                  example="新增/修改成功!",
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
     *                  example="修改信息失败!",
     *               ),
     *          @OA\Property(
     *                 type="object",
     *                 property="data",
     *                 example="错误信息",
     *              )
     *         )     *
     *     )
     * )
     */
    public function AddOrUpdate(Request $request)
    {

        $rules = [
            'avatar' => ['required', 'string'],
            'nickname' => ['required', 'string'],
            'birthday'=>['required','date_format:"Y-m-d"'],
            'gender' => ['nullable','integer', Rule::in([0, 1, 2])], //宠物性别
            'varietyId' => ['required', 'string'], //品种
            'shoulderHeight' => ['integer', 'gt:0'], //肩高
            'is_sterilization' => ['integer', 'gt:0'], //是否绝育
        ];
        $messages = [
            'avatar.required' => '请上传宠物头像!',
            'nickname.required' => '请填写宠物昵称!',
            'varietyId.required' => '请填写宠物品种!',
            'gender.required' => '请填写宠物性别!',
            'shoulderHeight.integer' => '肩高数据不正确!',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return json_encode(array(
                'status' => 500,
                'msg' => '修改失败!',
                'data' => $validator->errors(),
            ));
        } else {
            $data = (object) $request->all();
            $data->wcId = $request->user->id;
            return json_encode($this->petRepository->AddOrUpdate($data));
        }
    }

    /**
     * @OA\Get(
     *     path="/api/pet/list",
     *     tags={"小程序-宠物"},
     *     summary="获取宠物列表",
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
    public function GetList(Request $request)
    {
        // ->select('id as petId', 'avatar', 'nickname', 'breed', 'gender')->get()->toArray();
        $data = (object) $request->all();
        $data->wcId = $request->user->id;
        $pets = $this->petRepository->GetList($data)->get();
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取列表成功!',
                'data' => $pets,
            )
        );
    }

    /**
     * @OA\Get(
     *     path="/api/pet/{id}",
     *     tags={"小程序-宠物"},
     *     summary="获取宠物详细信息",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\Parameter(name="petId", in="query", @OA\Schema(type="int"), required=true, description="petId"),
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
     *                  example="获取宠物信息成功!",
     *              ),
     *            @OA\Property(
     *                  type="object",
     *                  property="data",
     *                  example="{'id':2,'avatar':'https:\/\/alicdn.imichong.com\/pet\/1597581562.png','nickname':'lucky','breed':'\u96ea\u7eb3\u745e','gender':'\u59b9\u59b9','birthday':'2020-07-16','grade':'\u5ba0\u7269\u7ea7','isSterilization':1}",
     *              )
     *         ),
     *    )
     * )
     */
    public function GetOne(Request $request)
    {
        // ->select('id as petId', 'avatar', 'nickname', 'breed', 'gender',
        //     'birthday', 'grade', 'is_sterilization as isSterilization')
        $pet = Pet::where('wcId', $request->user->id)->where('id', $request->id)->first();
        return json_encode(
            array(
                'status' => 200,
                'msg' => '获取宠物信息成功!',
                'data' => $pet)
        );
    }

    /**
     * @OA\Post(
     *     path="/api/pet/remove",
     *     tags={"小程序-宠物"},
     *     summary="删除宠物信息",
     *     @OA\Parameter(name="token", in="header", @OA\Schema(type="string"), required=true, description="token"),
     *     @OA\Parameter(name="petId", in="query", @OA\Schema(type="int"), required=true, description="petId"),
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
     *                  example="删除宠物信息成功!",
     *              )
     *         ),
     *    )
     * )
     */
    public function Remove(Request $request)
    {
        $pet = Pet::where('wcId', $request->user->id)->where('id', $request->petId)->first();
        if ($pet) {
            $pet->delete();
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '删除宠物信息成功!',
                    'data' => '')
            );
        }
        return json_encode(
            array(
                'status' => 500,
                'msg' => '删除宠物信息失败!',
                'data' => '')
        );
    }
}
