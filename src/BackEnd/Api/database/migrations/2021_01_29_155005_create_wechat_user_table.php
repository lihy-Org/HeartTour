<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWechatUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wechatUser', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('sessionkey')->comment('微信sessionkey');
            $table->string('openid')->comment('微信openid');
            $table->string('code')->comment('code');
            $table->string('token')->comment('token');
            $table->string('username')->nullable()->comment('用户名'); 
            $table->string('nickname')->nullable()->comment('昵称'); 
            $table->string('avatar')->nullable()->comment('用户头像'); 
            $table->unsignedTinyInteger('gender')->default(0)->comment('用户性别,0未知,1男,2女'); 
            $table->string('province')->nullable()->comment('省份'); 
            $table->string('city')->nullable()->comment('城市'); 
            $table->string('country')->nullable()->comment('区县'); 
            $table->string('address')->nullable()->comment('地址'); 
            $table->string('phone')->nullable()->comment('用户手机');
            $table->string('lastlogin')->nullable()->comment('最后登录时间');
            $table->unsignedTinyInteger('state')->default(0)->comment('状态，0：正常，1：禁用 ');
            $table->timestamps();           
            $table->softDeletes();
            $table->primary('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wechat_user');
    }
}
