<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLivePetTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('livePets', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->uuid('typeId')->comment('活体类型编号');
            $table->string('typeName')->comment('活体类型名称');
            $table->integer('gender')->comment('性别 0未知，1男，2女');
            $table->integer('vaccine')->comment('是否疫苗 1-已打疫苗 0-未打疫苗');
            $table->string('number')->comment('编号');
            $table->string('color')->comment('毛色 ');
            $table->string('varietyId')->comment('品种Id(配置id)');
            $table->string('variety')->comment('宠物品种名称');
            $table->decimal('originPrice', 8, 2)->comment('原价');
            $table->decimal('salePrice', 8, 2)->comment('售价 ');
            $table->integer('age')->comment('年龄');
            $table->integer('shoulderHeight')->nullable()->default(0)->comment('肩高');
            $table->string('note')->comment('备注');
            $table->string('avatar')->comment('头像');
            $table->integer('sales')->default(0)->comment('累计销量');
            $table->unsignedTinyInteger('state')->default(0)->comment('状态，0：待上架，1：已上架，2：已下架 ，3：已下架');
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
        Schema::dropIfExists('livePets');
    }
}
