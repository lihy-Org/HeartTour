<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefundRuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('refundRules', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->integer('minMin')->comment('最小分钟数');
            $table->integer('maxMin')->comment('最大分钟数');
            $table->unsignedDecimal('rate')->comment('费率'); 
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
        Schema::dropIfExists('refundRules');
    }
}
