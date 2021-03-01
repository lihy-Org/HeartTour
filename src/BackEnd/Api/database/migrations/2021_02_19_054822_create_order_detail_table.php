<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orderDetails', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->uuid('orderId')->comment('订单ID');
            $table->string('orderNo')->comment('订单编号');
            $table->uuid('goodsId')->comment('套餐ID/商品ID/活体ID');
            $table->Integer('num')->comment('商品数量');
            $table->unsignedDecimal('unitPrice', 11, 2)->comment('单价');
            $table->unsignedDecimal('totalMoney', 11, 2)->comment('总价');
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
        Schema::dropIfExists('orderDetails');
    }
}
