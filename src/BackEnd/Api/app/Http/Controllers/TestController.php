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
        dd(Carbon::Now()->format('Y-m-d H:i'));

        $data=$request->all();
        echo json_encode($data);
        $obj=(object)$data;
        echo $obj->id;
        //return json_encode(Store::all());

    }

}
