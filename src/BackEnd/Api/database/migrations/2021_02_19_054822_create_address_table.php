<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->uuid('id')->primary;
            $table->string('wcid')->comment('小程序用户id');
            $table->string('name')->comment('收件人');
            $table->string('phone')->comment('联系方式');
            $table->string('address')->comment('收货地址');
            $table->string('doorplate')->nullable()->default('')->comment('门牌号');
            $table->unsignedTinyInteger('default')->default(0)->comment('地址状态，0：非默认，1：默认');
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
        Schema::dropIfExists('addresses');
    }
}
