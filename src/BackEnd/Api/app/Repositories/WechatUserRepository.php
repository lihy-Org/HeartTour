<?php
namespace App\Repositories;

use App\Models\WechatUser;
use Illuminate\Support\Facades\DB;

class WechatUserRepository
{

    public function GetList($data)
    {
        $users = WechatUser::leftjoin(DB::raw('(SELECT wcId,count(1) count from pets WHERE deleted_at is NULL GROUP BY wcId) pets'),
            function ($join) {$join->on('pets.wcId', '=', 'wechatUser.id');
            })->leftjoin(DB::raw('(SELECT wcId,sum(payMoney) payMoney from orders WHERE deleted_at is NULL and state BETWEEN 200 and 500 GROUP BY wcId) payMoney'),
            function ($join) {$join->on('payMoney.wcId', '=', 'wechatUser.id');
            })->leftjoin(DB::raw('(SELECT wcId,count(1) apptCount from orders WHERE deleted_at is NULL and state BETWEEN 200 and 500 and type=1 GROUP BY wcId) apptCount'),
            function ($join) {$join->on('apptCount.wcId', '=', 'wechatUser.id');
            })
            ->orderBy('lastlogin');
        if (isset($data->searchKey)) {
            $users = $users->where(function ($query) use ($data) {
                $query->where('nickname', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('phone', 'like', '%' . $data->searchKey . '%');
            });
        }
        if (isset($data->phone)) {
            $users = $users->where('phone', $data->phone);
        }
        if (isset($data->state)) {
            $users = $users->where('state', $data->state);
        }
        if (isset($data->wcId)) {
            $users = $users->where('wcId', $data->wcId);
        }
        //累计消费 升序-ascend   降序-descend
        // if (isset($data->consumesSort)) {
        //     if ($data->consumesSort == 'ascend') {
        //         $users = $users->orderBy('lastlogin');
        //     } else {
        //         $users = $users->orderBy('lastlogin');
        //     }
        // }
        // aptTimesSort?: string; /** 预约次数  升序-ascend   降序-descend */
        if (isset($data->gender)) {
            $users = $users->where('gender', $data->gender);
        }
        return $users;
    }

    public function Remove($userId)
    {
        $user = WechatUser::find($userId);
        if ($user) {
            $user->state = $user->state == 0 ? 1 : 0;
            $user->save();
            return array(
                'status' => 200,
                'msg' => '禁用/启用成功!',
                'data' => '');
        }
        return array(
            'status' => 500,
            'msg' => '注销失败,找不到该用户!',
            'data' => '');

    }

}
