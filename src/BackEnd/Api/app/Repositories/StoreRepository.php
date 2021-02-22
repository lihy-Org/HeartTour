<?php
namespace App\Repositories;

use App\Models\Store;

class StoreRepository
{
    public function GetList($data)
    {
        $store = Store::orderBy('created_at');
        if (isset($data['searchKey'])) {
            $store = $store->where('name', 'like', '%' . $data['searchKey'] . '%');
        }
        return $store;
    }
    public function AddOrUpdate($data)
    {
        $store = null;
        if (isset($data->storeId)) {
            $store = Store::find($request->storeId);
        }

        if (!$store) {
            if (Store::where('name', $request->name)->first()) {
                return json_encode(
                    array(
                        'status' => 500,
                        'msg' => '重复店名!',
                        'data' => '',
                    )
                );
            }
            $store = Store::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'lng' => $request->lng,
                'lat' => $request->lat,
                'address' => $request->address,
                'businessHourStart' => $request->businessHourStart,
                'businessHourEnd' => $request->businessHourEnd,
                'type' => 1,
            ]);
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '添加信息成功!',
                    'data' => '',
                )
            );
        } else {
            $store->name = $request->name;
            $store->phone = $request->phone;
            $store->lng = $request->lng;
            $store->lat = $request->lat;
            $store->address = $request->address;
            $store->businessHourStart = $request->businessHourStart;
            $store->businessHourEnd = $request->businessHourEnd;
            $store->type = $request->type;
            $store->save();
            return json_encode(
                array(
                    'status' => 200,
                    'msg' => '修改信息成功!',
                    'data' => '')
            );
        }
    }
    public function GetSelectList()
    {
        return Store::where('state', '0')->select('id', 'name');
    }
}
