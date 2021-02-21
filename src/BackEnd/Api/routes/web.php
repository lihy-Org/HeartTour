<?php

use App\Http\Controllers\Admin\AccountController as AdminAccountController;
use App\Http\Controllers\Admin\ComboController;
use App\Http\Controllers\Admin\ConfigController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WechatUserController as AdminWechatUserController;
use App\Http\Controllers\StoreSystem\AccountController as StoreSysAccountController;
use App\Http\Controllers\StoreSystem\UserController as StoreSysUserController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\WechatUser\AddressController;
use App\Http\Controllers\WechatUser\AppointmentController;
use App\Http\Controllers\WechatUser\PetController;
use App\Http\Controllers\WechatUser\WechatUserController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'Test']);

// --------------------------------总台台---------------------------------------------
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

Route::prefix('api/admin')->middleware(['auth:sanctum', 'adminapi'])->group(function () {
    //门店管理
    Route::post('/store/list', [StoreController::class, 'GetList']);
    Route::post('/store/addOrUpdate', [StoreController::class, 'addOrUpdate']);
    Route::post('/store/switch', [StoreController::class, 'switch']);

    //配置
    Route::get('/config/{type}/{key?}', [ConfigController::class, 'getConfig']);
    Route::post('/config/addOrUpdate', [ConfigController::class, 'addOrUpdate']);
    Route::post('/config/remove', [ConfigController::class, 'Remove']);

    //人员管理
    Route::post('/user/addOrUpdate', [UserController::class, 'addOrUpdate']);
    Route::post('/user/list', [UserController::class, 'GetList']);
    Route::post('/user/remove', [UserController::class, 'Remove']);
    Route::post('/user/setStore', [UserController::class, 'SetStore']);
    Route::post('/user/setStoreManage', [UserController::class, 'SetStoreManage']);

    //用户
    Route::post('/wechat/list', [AdminWechatUserController::class, 'GetList']);
    Route::post('/wechat/remove', [AdminWechatUserController::class, 'Remove']);
    Route::post('/pet/list', [AdminWechatUserController::class, 'GetPetList']);

    //套餐管理
    Route::post('/combo/list', [ComboController::class, 'GetList']);
    Route::post('/combo/addOrUpdate', [ComboController::class, 'addOrUpdate']);
    Route::post('/combo/remove', [ComboController::class, 'Remove']);
    Route::post('/combo/setBeautician', [ComboController::class, 'SetBeautician']);
});

// ---------------------------------门店---------------------------------------------
Route::post('api/storesys/login', [StoreSysAccountController::class, 'Login']);
Route::get('api/storesys/login', function (Request $request) {
    return json_encode(
        array(
            'status' => 401,
            'msg' => '需要登录!',
            'data' => '')
    );
})->name('login');
Route::post('api/storesys/GetVerifCode', [AdminAccountController::class, 'GetVerifCode']);
Route::prefix('api/storesys')->middleware(['auth:sanctum', 'storeapi'])->group(function () {
    Route::post('/user/list', [StoreSysUserController::class, 'GetList']);
    Route::post('/user/setStoreManage', [StoreSysUserController::class, 'SetStoreManage']);
    Route::post('/user/setWorktime', [StoreSysUserController::class, 'SetWorktime']);

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
    Route::post('/pet/remove', [PetController::class, 'Remove']);

    //获取门店信息
    Route::post('/store/list', [StoreController::class, 'GetList']);

    //套餐管理
    Route::post('/combo/list', [ComboController::class, 'GetList']);

    //收货地址
    Route::post('/address/update', [AddressController::class, 'AddOrUpdate']);
    Route::get('/address/list', [AddressController::class, 'GetList']);
    Route::post('/address/delete', [AddressController::class, 'Delete']);

    //预约
    Route::post('/combo/appt', [AppointmentController::class, 'Appointment']);
});
