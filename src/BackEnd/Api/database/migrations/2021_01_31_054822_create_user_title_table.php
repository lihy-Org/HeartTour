<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserTitleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('userTitles', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('uid')->comment('用户编号');
            $table->string('titleId')->comment('头衔编号(配置id)');
            $table->string('title')->comment('头衔');
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
        Schema::dropIfExists('userTitles');
    }
}
