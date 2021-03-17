<?php

use App\Http\Controllers\Admin\AccountController as AdminAccountController;
use App\Http\Controllers\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Admin\ComboController as AdminComboController;
use App\Http\Controllers\Admin\ConfigController as AdminConfigController;
use App\Http\Controllers\Admin\OSSController as AdminOSSController;
use App\Http\Controllers\Admin\StoreController as AdminStoreController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\WechatUserController as AdminWechatUserController;
use App\Http\Controllers\Beautician\AccountController as BeautAccountController;
use App\Http\Controllers\Beautician\AppointmentController as BeautAppointmentController;
use App\Http\Controllers\Beautician\UserController as BeautUserController;
use App\Http\Controllers\StoreSystem\AccountController as StoreSysAccountController;
use App\Http\Controllers\StoreSystem\AppointmentController as StoreSysAppointmentController;
use App\Http\Controllers\StoreSystem\ComboController as StoreSysComboController;
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
    Route::post('/store/list', [AdminStoreController::class, 'GetList']);
    Route::post('/store/addOrUpdate', [AdminStoreController::class, 'AddOrUpdate']);
    Route::post('/store/remove', [AdminStoreController::class, 'Remove']);
    Route::get('/store/getSelectList', [AdminStoreController::class, 'GetSelectList']);
    //配置
    Route::get('/config/{type}/{key?}', [AdminConfigController::class, 'GetConfig']);
    Route::post('/config/addOrUpdate', [AdminConfigController::class, 'AddOrUpdate']);
    Route::post('/config/remove', [AdminConfigController::class, 'Remove']);

    //人员管理
    Route::post('/user/addOrUpdate', [AdminUserController::class, 'AddOrUpdate']);
    Route::post('/user/list', [AdminUserController::class, 'GetList']);
    Route::post('/user/remove', [AdminUserController::class, 'Remove']);
    Route::post('/user/setStore', [AdminUserController::class, 'SetStore']);
    Route::post('/user/setManage', [AdminUserController::class, 'SetManage']);
    Route::get('/user/getSelectList', [AdminUserController::class, 'GetSelectList']);
    Route::post('/user/setType', [AdminUserController::class, 'SetType']);
    //用户
    Route::post('/wechat/list', [AdminWechatUserController::class, 'GetList']);
    Route::post('/wechat/remove', [AdminWechatUserController::class, 'Remove']);
    Route::get('/pet/list', [AdminWechatUserController::class, 'GetPetList']);

    //套餐管理
    Route::post('/combo/list', [AdminComboController::class, 'GetList']);
    Route::post('/combo/addOrUpdate', [AdminComboController::class, 'AddOrUpdate']);
    Route::post('/combo/remove', [AdminComboController::class, 'Remove']);
    Route::post('/combo/setBeautician', [AdminComboController::class, 'SetBeautician']);

    //预约管理
    Route::post('/appt/list', [AdminAppointmentController::class, 'GetList']);
    Route::post('/appt/getWorktime', [AdminAppointmentController::class, 'GetWorktime']);
    Route::post('/appt/trans', [AdminAppointmentController::class, 'TransferAppt']);
    Route::post('/appt/offlineAppt', [AdminAppointmentController::class, 'OfflineAppt']);
    //OSS
    Route::get('/oss/getKey', [AdminOSSController::class, 'GetKey']);
    //活体
    // Route::post('/live/addOrUpdate', [AdminLivePetController::class, 'AddOrUpdate']);
    // Route::post('/live/remove', [AdminLivePetController::class, 'Remove']);
    // Route::post('/live/list', [AdminLivePetController::class, 'GetList']);
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
    Route::post('/user/setWorktime', [StoreSysUserController::class, 'SetWorktime']);
    Route::post('/user/tranStore', [StoreSysUserController::class, 'TranStore']);
    Route::post('/user/setKpi', [StoreSysUserController::class, 'SetKpi']);
    Route::post('/user/kpiList', [StoreSysUserController::class, 'GetKpiList']);
    //预约管理
    Route::post('/appt/list', [StoreSysAppointmentController::class, 'GetList']);
    Route::post('/appt/getWorktime', [StoreSysAppointmentController::class, 'GetWorktime']);
    Route::post('/appt/getStatsWorktime', [StoreSysAppointmentController::class, 'getStatsWorktime']);
    Route::post('/appt/trans', [StoreSysAppointmentController::class, 'TransferAppt']);
    Route::post('/appt/refund', [StoreSysAppointmentController::class, 'Refund']);
    Route::post('/appt/changeState', [StoreSysAppointmentController::class, 'ChangeState']);
    Route::post('/appt/addRemark', [StoreSysAppointmentController::class, 'AddStoreRemark']);
    Route::post('/appt/offlineAppt', [StoreSysAppointmentController::class, 'OfflineAppt']);
    //配置
    Route::get('/config/{type}/{key?}', [AdminConfigController::class, 'GetConfig']);
    //用户
    Route::post('/wechat/list', [AdminWechatUserController::class, 'GetList']);
    Route::get('/pet/list', [AdminWechatUserController::class, 'GetPetList']);
    //OSS
    Route::get('/oss/getKey', [AdminOSSController::class, 'GetKey']);

    //套餐
    Route::post('/combo/list', [StoreSysComboController::class, 'GetList']);

});
// --------------------------------小程序---------------------------------------------
Route::post('api/user/login', [WechatUserController::class, 'WeAppLogin']);

Route::prefix('api')->middleware(['web', 'wechatapi'])->group(function () {
    //用户
    Route::post('/user/edit', [WechatUserController::class, 'Edit']);
    Route::post('/user/editPhone', [WechatUserController::class, 'EditPhone']);
    //  Route::get('/user', 'WechatUser\WechatUserController@GetUserInfo');

    //配置
    Route::get('/config/{type}/{key?}', [AdminConfigController::class, 'GetConfig']);

    //宠物
    Route::post('/pet/addOrUpdate', [PetController::class, 'AddOrUpdate']);
    Route::post('/pet/list', [PetController::class, 'GetList']);
    Route::get('/pet/{id}', [PetController::class, 'GetOne']);
    Route::post('/pet/remove', [PetController::class, 'Remove']);

    //获取门店信息
    Route::post('/store/list', [AdminStoreController::class, 'GetList']);

    //套餐管理
    Route::post('/combo/list', [AdminComboController::class, 'GetList']);

    //收货地址
    Route::post('/address/addOrUpdate', [AddressController::class, 'AddOrUpdate']);
    Route::post('/address/list', [AddressController::class, 'GetList']);
    Route::post('/address/remove', [AddressController::class, 'Remove']);

    //预约
    Route::post('/appt/add', [AppointmentController::class, 'Appointment']);
    Route::post('/appt/getWorktime', [AppointmentController::class, 'GetWorktime']);
    Route::post('/appt/pay', [AppointmentController::class, 'Pay']);
    Route::post('/appt/paid', [AppointmentController::class, 'Paid']);
    //OSS
    Route::get('/oss/getKey', [AdminOSSController::class, 'GetKey']);
});

// --------------------------------技师---------------------------------------------
Route::post('api/beaut/login', [BeautAccountController::class, 'Login']);
Route::get('api/beaut/login', function (Request $request) {
    return json_encode(
        array(
            'status' => 401,
            'msg' => '需要登录!',
            'data' => '')
    );
})->name('login');
Route::post('api/beaut/GetVerifCode', [AdminAccountController::class, 'GetVerifCode']);
Route::prefix('api/beaut')->middleware(['auth:sanctum', 'beautapi'])->group(function () {

    //人员信息
    Route::get('/user/info', [BeautUserController::class, 'GetInfo']);
    Route::get('/user/kpi', [BeautUserController::class, 'GetKpi']);
    //预约管理
    Route::post('/appt/list', [BeautAppointmentController::class, 'GetList']);
    Route::post('/appt/changeState', [BeautAppointmentController::class, 'ChangeState']);
});
