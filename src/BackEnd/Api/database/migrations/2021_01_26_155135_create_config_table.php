<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConfigTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configs', function (Blueprint $table) {
            $table->uuid('id');
            $table->string('type')->comment('配置类型');
            $table->string('key')->comment('配置键');
            $table->string('value')->comment('配置值'); 
            $table->integer('sort')->default(1)->comment('排序');     
            $table->string('parentId')->nullable()->comment('父id');             
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
        Schema::dropIfExists('configs');
    }
}
