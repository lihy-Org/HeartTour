<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderRefundTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orderRefunds', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->uuid('orderId')->comment('订单id');
            $table->string('refundNo')->comment('退款编号');
            $table->uuid('wcid')->comment('小程序用户id');
            $table->uuid('wcName')->comment('小程序名称');
            $table->unsignedTinyInteger('type')->default(1)->comment('售后类型1仅退款2退货退款');
            $table->unsignedDecimal('money', 11, 2)->comment('退款金额');
            $table->string('reason')->comment('退款原因');
            $table->string('images')->comment('图片凭证');
            $table->string('refuseReason')->default('')->comment('拒绝退款原因');
            $table->string('merchantName')->default('')->comment('退货收件人');
            $table->string('merchantPhone')->default('')->comment('退货联系方式');
            $table->string('merchantAddress')->default('')->comment('退货收货地址');
            $table->string('merchantDoorplate')->default('')->nullable()->default('')->comment('退货收货地址门牌号');
            $table->string('expName')->default('')->comment('快递公司名称');
            $table->string('expNumber')->default('')->comment('快递单号');
            $table->unsignedTinyInteger('cargoStatus')->default(1)->comment('货物状态参数 1：已收到后 2：未收到货');
            $table->unsignedTinyInteger('state')->default(0)->comment('状态（0待确认, 100待退货, 200退货中, 300已完成, 301已拒绝, 302已取消）');
            $table->uuid('userId')->comment('操作人id');
            $table->string('userName')->comment('操作人姓名');
            $table->timestamp('examineDate')->comment('操作时间');
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
        Schema::dropIfExists('orderRefunds');
    }
}
