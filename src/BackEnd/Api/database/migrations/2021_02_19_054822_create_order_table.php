<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('orderNo')->comment('订单编号');
            $table->uuid('wcId')->comment('小程序用户id');
            $table->string('wcName')->comment('小程序用户姓名');
            $table->string('phone')->nullable()->comment('联系方式');
            // 预约的信息
            $table->uuid('petId')->nullable()->comment('预约宠物Id');
            $table->integer('petType')->nullable()->comment('宠物种类');
            $table->uuid('userId')->nullable()->comment('预约技师id');
            $table->string('userName')->nullable()->comment('预约技师姓名');
            $table->uuid('storeId')->nullable()->comment('预约门店id');
            $table->string('storeName')->nullable()->comment('预约门店名称');
            $table->string('mainComboName')->nullable()->comment('主套餐名称');
            $table->string('apptTime')->nullable()->comment('预约日');
            //订单的信息
            $table->uuid('addId')->nullable()->comment('收货地址id');
            $table->string('address')->nullable()->comment('收货地址信息');
            $table->uuid('expId')->nullable()->comment('快递信息编号');
            $table->string('expName')->nullable()->default('')->comment('快递公司名称');
            $table->string('expNumber')->nullable()->default('')->comment('快递单号');

            $table->unsignedDecimal('totalMoney', 11, 2)->comment('订单总价');
            $table->unsignedDecimal('freight', 11, 2)->default(0)->comment('运费');
            $table->unsignedDecimal('payMoney', 11, 2)->comment('最终支付总价');
            $table->unsignedInteger('payType')->default(1)->comment('支付方式，1微信支付');
            $table->unsignedInteger('type')->default(1)->comment('订单类型，1套餐预约，20商城,30活体');
            $table->timestamp('payTime')->nullable()->comment('付款时间');
            $table->timestamp('shippingTime')->nullable()->comment('发货时间');
            $table->timestamp('finishTime')->nullable()->comment('完成时间');
            $table->timestamp('cancelTime')->nullable()->comment('取消时间');
            $table->unsignedInteger('state')->default(100)->comment('待支付100、 待发货/已预约200、进行中（技师点击开始服务）300 已发货/待接取400、
            已收货/已完成500、拒绝退款501 完成退款502 申请退款\售后 600 、退货售后中 601');
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
        Schema::dropIfExists('orders');
    }
}
