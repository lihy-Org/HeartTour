<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComboTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('combos', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('comboType')->comment('套餐类型：0-主套餐  1-增项套餐');
            $table->string('name')->comment('套餐名称');
            $table->string('desc')->comment('套餐描述');
            $table->decimal('originPrice',8,2)->comment('原价');
            $table->decimal('salePrice',8,2)->comment('售价 ');
            $table->integer('nursingTime')->comment('护理时长(分钟)');
            $table->string('bgImg')->comment('背景图');
            $table->integer('sales')->default(0)->comment('累计销量');
            $table->unsignedTinyInteger('state')->default(0)->comment('状态，0：待上架，1：已上架，1：已下架 ');
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
        Schema::dropIfExists('combos');
    }
}
