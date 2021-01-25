<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\Admin\StoreController;

Route::post('api/admin/login', 'Admin\AccountController@Auth');

Route::get('api/admin/login', function (Request $request) {
    return json_encode(
        array(
            'status' => 401,
            'msg' => '需要登录!',
            'data' => '')
    );
})->name('login');


Route::get('/test',[TestController::class,'Test']);


//后台
//门店管理
Route::post('api/store/list', [StoreController::class,'list']);
Route::post('api/store/addOrUpdate', [StoreController::class,'addOrUpdate']);
Route::post('api/store/switch', [StoreController::class,'switch']);

Route::prefix('api/admin')->middleware(['auth:sanctum', 'adminapi'])->group(function () {
    //商品管理
    Route::post('/goods/list', 'Admin\GoodsController@GetGoodsList');
    Route::get('/goods/{goodsId}', 'Admin\GoodsController@Details')->where('goodsId', '[0-9]+');
    Route::post('/goodscomments/list', 'Admin\GoodsController@GetGoodsCommentsList');
    Route::post('/goods/status', 'Admin\GoodsController@switchStatus');

    //商户申请
    Route::post('/user/applyList', 'Admin\AccountController@GetApplyList');
    Route::post('/user/examine', 'Admin\AccountController@Examine');

    //订单管理
    Route::post('/order/refundList', 'Admin\OrderController@GetRefundList');
    Route::post('/order/examine', 'Admin\OrderController@Examine');
    Route::post('/order/confirmRefundExp', 'Admin\OrderController@ConfirmRefundExp');
});
