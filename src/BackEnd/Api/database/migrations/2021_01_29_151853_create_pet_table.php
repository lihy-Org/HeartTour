<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePetTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->uuid('id')->primary;          
            $table->string('wcId')->comment('小程序用户id');
            $table->string('avatar')->comment('宠物头像');
            $table->string('nickname')->comment('宠物昵称');
            $table->integer('gender')->comment('性别 0未知，1男，2女');     
            $table->string('typeId')->comment('宠物种类编号');
            $table->string('type')->comment('宠物种类');
            $table->string('varietyId')->comment('品种Id(配置id)');
            $table->string('variety')->comment('宠物品种名称');
            $table->timestamp('birthday')->comment('宠物生日');
            $table->string('color')->nullable()->default('')->comment('毛色');
            $table->string('shoulderHeight')->nullable()->default(0)->comment('肩高');
            $table->unsignedTinyInteger('is_sterilization')->default(1)->comment('是否绝育，0：未绝育，1：已绝育');
            $table->string('remark')->nullable()->default('')->comment('备注');
            $table->primary('id');
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
        Schema::dropIfExists('pets');
    }
}
