<?php

use App\Http\Controllers\Admin\AccountController as AdminAccountController;
use App\Http\Controllers\Admin\ConfigController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\WechatUser\PetController;
use App\Http\Controllers\WechatUser\WechatUserController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'Test']);

// --------------------------------登录开始---------------------------------------------
Route::post('api/admin/login', [AdminAccountController::class, 'Login']);
Route::get('api/admin/login', function (Request $request) {
    return json_encode(
        array(
            'status' => 401,
            'msg' => '需要登录!',
            'data' => '')
    );
})->name('login');
Route::post('api/admin/GetVerifCode', [AdminAccountController::class, 'GetVerifCode']);
// --------------------------------登录结束---------------------------------------------

// --------------------------------后台---------------------------------------------

Route::prefix('api/admin')->middleware(['auth:sanctum', 'adminapi'])->group(function () {
    //门店管理
    Route::post('/store/list', [StoreController::class, 'list']);
    Route::post('/store/addOrUpdate', [StoreController::class, 'addOrUpdate']);
    Route::post('/store/switch', [StoreController::class, 'switch']);

    //配置
    Route::get('/config/{type}/{key?}', [ConfigController::class, 'getConfig']);
    Route::post('/config/addOrUpdate', [ConfigController::class, 'addOrUpdate']);
    Route::post('/config/delete', [ConfigController::class, 'delete']);

    //用户管理
    Route::post('/user/addOrUpdate', [UserController::class, 'addOrUpdate']);
    Route::post('/user/list', [UserController::class, 'GetList']);
    Route::post('/user/remove', [UserController::class, 'Remove']);
    Route::post('/user/setStore', [UserController::class, 'SetStore']);
    Route::post('/user/setStoreManage', [UserController::class, 'SetStoreManage']);
});

// --------------------------------小程序---------------------------------------------
Route::post('api/user/login', [WechatUserController::class, 'WeAppLogin']);

Route::prefix('api')->middleware(['web', 'wechatapi'])->group(function () {
    //用户
    Route::post('/user/edit', [WechatUserController::class, 'Edit']);
    Route::post('/user/editPhone', [WechatUserController::class, 'EditPhone']);
    //  Route::get('/user', 'WechatUser\WechatUserController@GetUserInfo');

    //宠物
    Route::post('/pet/addOrUpdate', [PetController::class, 'AddOrUpdate']);
    Route::get('/pet/list', [PetController::class, 'GetList']);
    Route::get('/pet/{id}', [PetController::class, 'GetOne']);
    Route::post('/pet/delete', [PetController::class, 'Delete']);

});
