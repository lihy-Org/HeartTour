<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComboBeauticianTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comboBeauticians', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('cid')->comment('套餐编号');
            $table->string('cname')->comment('套餐简介');          
            $table->string('userId')->comment('美容师编号');
            $table->string('userName')->comment('美容师名称');
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
        Schema::dropIfExists('comboBeauticians');
    }
}
