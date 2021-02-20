<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComboStoreTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comboStores', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('cid')->comment('套餐编号');
            $table->string('cname')->comment('套餐简介');
            $table->string('storeId')->comment('门店编号');
            $table->string('storeName')->comment('门店名称');
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
        Schema::dropIfExists('comboStores');
    }
}
