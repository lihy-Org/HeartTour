<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComboVarietyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comboVarieties', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('cid')->comment('套餐编号');
            $table->string('varietyId')->comment('品种(配置id)');
            $table->string('variety')->comment('品种名称');
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
        Schema::dropIfExists('comboVarieties');
    }
}
