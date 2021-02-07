<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('name')->comment('门店名称');
            $table->string('phone')->comment('联系电话');
            $table->string('lng')->comment('经度');
            $table->string('lat')->comment('纬度');
            $table->string('address')->comment('详细地址'); 
            $table->string('businessHourStart')->comment('营业时间起 09:30');
            $table->string('businessHourEnd')->comment('营业时间止  20:30');
            $table->string('shopManagerId')->nullable()->comment('门店店长编号');
            $table->string('shopManager')->nullable()->comment('门店店长');
            $table->tinyInteger('type')->default(1)->comment('类型1分店，2总店'); 
            $table->tinyInteger('state')->default(0)->comment('状态0正常，1停止营业'); 
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stores');
    }
}
