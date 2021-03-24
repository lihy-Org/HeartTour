<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Carbon\Carbon;
class TestController extends Controller
{

    public function Test(Request $request)
    {
        $date = '2021-03-25 20:59:00';
        $carbon = carbon::parse ($date); 
        dd(Carbon::now()->diffInMinutes($carbon, false));

        $data=$request->all();
        echo json_encode($data);
        $obj=(object)$data;
        echo $obj->id;
        //return json_encode(Store::all());

    }

}
