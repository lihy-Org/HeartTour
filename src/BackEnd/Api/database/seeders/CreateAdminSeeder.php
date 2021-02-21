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
    }
}
