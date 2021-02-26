<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Webpatser\Uuid\Uuid;

class CreateAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert(['id'=>Uuid::generate(),'name' => '超级管理员', 'avatar' => '', 'gender' => 1, 'age' => 18,
         'postId' => 1, 'post' => 'xx', 'phone' => '15828242712', 'type' => 0]);

         DB::table('wechatUser')->insert(['id'=>Uuid::generate(),'sessionkey' => 'KajO5NY2UXNHN3Piy/kCJA==', 'openid' => 'o-_K55S0fQiHfNe7_7WPfyV5LXws'
         , 'code'=>'023K2yFa1jqGvz0wf1Ja1zbCc83K2yFe','token' => 'e57ba0bd56abdb318c6c39c1e133530d', 
         'nickname' =>'星轨' ,'gender'=>1,'state'=>0, 
         'avatar' => 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqYLIk6CAiaQQAmywjREtoMXEMcCIbB4k188DKcc2AibPcsgURwCoSmjDgnGrLyXSsOs4ZWI7eh2rlQ/0', 
         'phone' => '15828242712']);

         DB::table('configs')->insert(['id'=>Uuid::generate(),'type' => 'TimeSlot', 'key' => 'TimeSlot', 'value'=>'30']);
    }
}
