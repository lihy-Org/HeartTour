<?php
namespace App\Repositories;

use App\Models\Combo;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\UserWorktime;
use App\Models\WechatUser;
use App\Repositories\ConfigRepository;
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
            foreach ($data->comboIds as $v) {
                $combo = Combo::find($v);
                array_push($combos, $combo);
                $allTime = bcadd($allTime, $combo->nursingTime);
                $totalMoney = bcadd($totalMoney, $combo->salePrice, 2);
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
                if ($usertime == null || $usertime->orderId != null) {
                    return array(
                        'status' => 500,
                        'msg' => '预约失败,技师' . $usertime->workTime . '已被预约!',
                        'data' => '');

                }
                array_push($apptUserWorktimes, $usertime);
            }
            $wc = WechatUser::find($data->wcId);
            //保存主订单
            $order = Order::create([
                'orderNo' => app('snowflake')->id(),
                'wcId' => $data->wcId,
                'wcName' => $wc->nickname,
                'petId' => $data->petId,
                'userId' => $data->userId,
                'storeId' => $data->storeId,
                'apptTime' => $data->workDay,
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
}
