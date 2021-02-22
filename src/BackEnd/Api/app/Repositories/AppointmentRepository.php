<?php
namespace App\Repositories;

use App\Models\Combo;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Pet;
use App\Models\Store;
use App\Models\User;
use App\Models\UserWorktime;
use App\Models\WechatUser;
use App\Repositories\ConfigRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AppointmentRepository
{

    public function Appointment($data)
    {
        try {
            $ConfigRepository = new ConfigRepository();
            $config = $ConfigRepository->GetOne('TimeSlot', 'TimeSlot')->first();
            $combos = [];
            $allTime = 0; //套餐总时间
            $totalMoney = 0; //总价格
            $mainCombo = null;
            foreach ($data->comboIds as $v) {
                $combo = Combo::find($v);
                //有且只能有一个主套餐
                if ($combo->comboType == 0) {
                    if ($mainCombo != null) {
                        return array(
                            'status' => 500,
                            'msg' => '预约失败，主套餐数据必须为1!',
                            'data' => '');
                    } else {
                        $mainCombo = $combo;
                    }
                }
                array_push($combos, $combo);
                $allTime = bcadd($allTime, $combo->nursingTime);
                $totalMoney = bcadd($totalMoney, $combo->salePrice, 2);
            }
            if ($mainCombo == null) {
                return array(
                    'status' => 500,
                    'msg' => '预约失败，主套餐数据必须为1!',
                    'data' => '');
            }
            if ($allTime == 0) {
                return array(
                    'status' => 500,
                    'msg' => '预约失败，套餐总护理时间为0!',
                    'data' => '');
            }
            $times = ceil(bcdiv($allTime, $config->value, 2));

            DB::beginTransaction(); // 开启事务
            //预约当日技师时间
            $apptUserWorktimes = [];
            $usertimes = UserWorktime::where('workDay', $data->workDay)->where('uid', $data->userId)
                ->where('workTime', '>=', $data->workTime)->orderby('workTime')->get();
            if ($usertimes->count() <= 0 || $usertimes->count() < $times) {
                return array(
                    'status' => 500,
                    'msg' => '预约失败,该技师无可预约时间!',
                    'data' => '');
            }
            for ($i = 0; $i < $times; $i++) {
                $usertime = $usertimes[$i];
                //第一个时间不是选择的时间 说明该技师在选择时间还未排班
                if ($data->workTime != $usertime->workTime) {
                    return array(
                        'status' => 500,
                        'msg' => '预约失败,技师' . $usertime->workTime . '还没进行排期!',
                        'data' => '');
                }
                if ($usertime == null || $usertime->orderId != null) {
                    return array(
                        'status' => 500,
                        'msg' => '预约失败,技师' . $usertime->workTime . '已被预约!',
                        'data' => '');

                }
                array_push($apptUserWorktimes, $usertime);
            }
            $wc = WechatUser::find($data->wcId);
            $user = User::find($data->userId);
            $store = Store::find($data->storeId);
            $pet = Pet::find($data->petId);
            //保存主订单
            $order = Order::create([
                'orderNo' => app('snowflake')->id(),
                'wcId' => $data->wcId,
                'wcName' => $wc->nickname,
                'petId' => $data->petId,
                'petType' => $pet->type,
                'userId' => $data->userId,
                'userName' => $user->name,
                'storeId' => $data->storeId,
                'storeName' => $store->name,
                'phone' => $wc->phone,
                'mainComboName' => $mainCombo->name,
                'apptTime' => $data->workDay . $apptUserWorktimes[0]->workTime,
                'totalMoney' => $totalMoney,
                'freight' => 0,
                'payMoney' => $totalMoney,
                'payType' => 1,
                'type' => 1,
            ]);
            //保存订单详细信息
            foreach ($combos as $combo) {
                OrderDetail::create([
                    'orderId' => $order->id,
                    'orderNo' => $order->orderNo,
                    'goodId' => $combo->id,
                    'num' => 1,
                    'unitPrice' => $combo->salePrice,
                    'totalMoney' => $combo->salePrice,
                ]);
            }
            //保存用户预约信息
            for ($i = 0; $i < $times; $i++) {
                $usertime = $apptUserWorktimes[$i];
                $usertime->orderId = $order->id;
                if ($i == 0) {
                    $usertime->orderPrice = $totalMoney;
                }
                $usertime->save();
            }
            Db::commit(); // 提交事务
            return array(
                'status' => 200,
                'msg' => '添加信息成功!',
                'data' => '');

        } catch (\Exception $exception) {
            // dd($exception);
            Db::rollback(); // 回滚事务
            return array(
                'status' => 500,
                'msg' => '保存失败!' . $exception->getMessage(),
                'data' => '');
        }
    }

    public function GetList($data)
    {
        $orders = Order::where('type', '1')->orderBy('created_at');
        if (isset($data->searchKey)) {
            $orders = $orders->where(function ($query) use ($data) {
                $query->where('wcName', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('userName', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('mainComboName', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('phone', 'like', '%' . $data->searchKey . '%');
            });
        }
        if (isset($data->storeId)) {
            $orders = $orders->where('storeId', $data->storeId);
        }
        if (isset($data->state)) {
            //已预约
            if ($data->state == 0) {
                $orders = $orders->where('state', 300);
            }
            //进行中
            if ($data->state == 1) {
                $orders = $orders->where('state', 350);
            }
            //待接取
            if ($data->state == 2) {
                $orders = $orders->where('state', 400);
            }
            //已完成
            if ($data->state == 3) {
                $orders = $orders->where('state', 500);
            }

        }
        if (isset($data->startDate) && isset($data->endDate)) {
            $orders = $orders->whereBetween('apptTime', [$data->startDate, $data->endDate]);
        }
        return $orders;
    }

    public function GetWorktime($data)
    {
        return UserWorktime::where('workDay', '>=', Carbon::now())->where('storeId', $data->storeId)
        ->select('storeId', 'uid', 'uname', 'workDay', 'workTime','orderId');
    }

    public function SetWorktime($data)
    {
        try {
            DB::beginTransaction(); // 开启事务
            $user = User::find($data->userId);
            $store = Store::find($user->storeId);
            $ConfigRepository = new ConfigRepository();
            $config = $ConfigRepository->GetOne('TimeSlot', 'TimeSlot')->first();
            $startTime = $store->businessHourStart;
            $endTime = $store->businessHourEnd;
            foreach ($data->days as $v) {
                if (UserWorktime::where('workDay', $v)->where('uid', $user->id)->whereNotNull('orderId')->count() > 0) {
                    Db::rollback(); // 回滚事务
                    return array(
                        'status' => 500,
                        'msg' => '设置失败，' . $v . '日该人员已被预约不可再进行排期!',
                        'data' => '');
                }
                UserWorktime::where('workDay', $v)->where('uid', $user->id)->delete();
                if (isset($data->startTime) && isset($data->endTime)) {
                    $startTime = $data->startTime;
                    $endTime = $data->endTime;
                }
                $st = Carbon::parse($v . ' ' . $startTime . ':00');
                $et = Carbon::parse($v . ' ' . $endTime . ':00');
                while ($et->gt($st)) {
                    UserWorktime::create(['workDay' => $st->format('Y-m-d'), 'workTime' => $st->format('H:i'), 'storeId' => $user->storeId, 'uid' => $user->id, 'uname' => $user->name]);
                    $st = $st->addMinutes($config->value);
                }
            }
            Db::commit(); // 提交事务
            return array(
                'status' => 200,
                'msg' => '设置成功!',
                'data' => '');
        } catch (\Exception $ex) {
            Db::rollback(); // 回滚事务
            return array(
                'status' => 500,
                'msg' => '失败!' . $ex->getMessage(),
                'data' => '');
        }
    }
}
