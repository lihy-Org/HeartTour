<?php

use App\Http\Controllers\Admin\AccountController as AdminAccountController;
use App\Http\Controllers\Admin\ConfigController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\TestController;
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

// --------------------------------后台结束---------------------------------------------

Route::prefix('api/admin')->middleware(['auth:sanctum', 'adminapi'])->group(function () {
    //门店管理
    Route::post('/store/list', [StoreController::class, 'list']);
    Route::post('/store/addOrUpdate', [StoreController::class, 'addOrUpdate']);
    Route::post('/store/switch', [StoreController::class, 'switch']);

//配置
    Route::get('/config/{type}/{key?}', [ConfigController::class, 'getConfig']);
    Route::post('/config/addOrUpdate', [ConfigController::class, 'addOrUpdate']);
    Route::post('/config/delete', [ConfigController::class, 'delete']);
});
