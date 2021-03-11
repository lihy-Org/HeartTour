<?php
namespace App\Repositories;

use App\Models\Address;

class AddressRepository
{

    public function AddOrUpdate($data)
    {
        //如果此地址是默认，则把其他地址调整为非默认
        if (isset($data->default) && $data->default == 1) {
            Address::where('wcid', $data->wcId)->update(['default' => 0]);
        }
        $addr = Address::updateOrCreate(
            ['id' => $data->addrId], [
                'wcId' => $data->wcId,
                'name' => $data->name,
                'phone' => $data->phone,
                'address' => $data->address,
                'doorplate' => isset($data->doorplate) ? $data->doorplate : "",
                'default' => isset($data->default) ? $data->default : 0,
            ]);
        if ($addr) {
            return array(
                'status' => 200,
                'msg' => '新增/修改地址成功!',
                'data' => '',
            );

        } else {
            return array(
                'status' => 500,
                'msg' => '新增/修改地址失败!',
                'data' => '',
            );

        }
    }

    public function GetList($data)
    {
        return Address::where('wcId', $data->wcId);
    }

}
