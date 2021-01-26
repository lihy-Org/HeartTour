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
            $table->uuid('id');
            $table->string('name')->comment('用户名'); 
            $table->string('phone')->comment('手机');
            $table->string('avatar')->comment('头像');
            $table->string('gender')->comment('性别 ');
            $table->integer('age')->comment('年龄');
            $table->integer('titleId')->comment('头衔编号');
            $table->string('title')->comment('头衔');
            $table->integer('postId')->comment('职位编号');
            $table->string('post')->comment('职位');
            $table->integer('type')->default(3)->comment('0：1+2的集合 1:超管系统管理员，2:门店系统管理员（店长） 3:普通人员');
            $table->string('storeId')->nullable()->comment('所属门店编号');
            $table->string('storeName')->nullable()->comment('所属门店名称');
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
