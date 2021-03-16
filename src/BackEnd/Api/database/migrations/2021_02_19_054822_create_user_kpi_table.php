<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserKPITable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('userKpis', function (Blueprint $table) {
            $table->uuid('id')->primary;   
            $table->string('storeId')->comment('门店编号');        
            $table->string('userId')->comment('人员编号');           
            $table->string('userName')->comment('人员名称');
            $table->string('month')->comment('月份');
            $table->unsignedDecimal('kpi',11,2)->comment('业绩目标');
            $table->string('setId')->comment('制定人员编号');           
            $table->string('setName')->comment('制定人员名称');
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
        Schema::dropIfExists('userKpis');
    }
}
