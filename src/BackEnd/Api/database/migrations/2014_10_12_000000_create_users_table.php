<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('name')->comment('姓名'); 
            $table->string('avatar')->comment('头像');
            $table->string('gender')->comment('性别 0未知，1男，2女');            
            $table->integer('age')->comment('年龄');       
            $table->string('postId')->comment('职位');
            $table->string('post')->comment('职位');
            $table->integer('isBeautician')->default(0)->comment('0:不是技师,1：技师');
            $table->string('phone')->comment('手机')->unique();
            $table->string('storeId')->nullable()->comment('所属门店编号');
            $table->string('store')->nullable()->comment('所属门店名称'); 
            $table->integer('type')->default(3)->comment('0：1+2的集合 1:超管系统管理员，2:门店系统管理员（店长） 3:普通人员');            
            $table->tinyInteger('state')->default(0)->comment('状态0正常，1离职'); 
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
