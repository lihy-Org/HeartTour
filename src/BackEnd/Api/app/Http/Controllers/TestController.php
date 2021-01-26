<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class TestController extends Controller
{

    public function Test(Request $request)
    {
        Store::create(['title'=>'xxx']);
        return json_encode(Store::all());

    }

}
