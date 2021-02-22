<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserWorktimeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('userWorktimes', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('workDay')->comment('工作日');
            $table->string('workTime')->comment('工作时间');
            $table->string('uid')->comment('人员编号');           
            $table->string('uname')->comment('人员名称');
            $table->string('storeId')->comment('门店编号');
            $table->string('orderId')->nullable()->comment('订单编号');
            $table->string('orderPrice')->nullable()->comment('订单价格');
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
        Schema::dropIfExists('userWorktimes');
    }
}
