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
use Illuminate\Support\Facades\Log;

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
            if (bccomp($totalMoney, $data->totalMoney, 10) !== 0) {
                return array(
                    'status' => 500,
                    'msg' => '预约失败，订单金额有误!',
                    'data' => '');
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
                if ($i == 0 && $data->workTime != $usertime->workTime) {
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
            $store = Store::find($user->storeId);
            $pet = Pet::find($data->petId);
            //保存主订单
            $order = Order::create([
                'orderNo' => app('snowflake')->id(),
                'wcId' => $data->wcId,
                'wcName' => $wc->nickname,
                'remark' => isset($data->remark) ? $data->remark : '',
                'petId' => $data->petId,
                'petName' => $pet->nickname,
                'petType' => $pet->type,
                'userId' => $data->userId,
                'userName' => $user->name,
                'storeId' => $user->storeId,
                'storeName' => $store->name,
                'phone' => $wc->phone,
                'mainComboName' => $mainCombo->name,
                'serviceTime' => $allTime,
                'apptTime' => $data->workDay . ' ' . $apptUserWorktimes[0]->workTime,
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
                    'goodsId' => $combo->id,
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

    //线下加单
    public function OfflineAppt($data)
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
            if (bccomp($totalMoney, $data->totalMoney, 10) !== 0) {
                return array(
                    'status' => 500,
                    'msg' => '预约失败，订单金额有误!',
                    'data' => '');
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
            //修改 是删除以前的老订单，新增新的订单
            if (isset($data->orderId)) {
                Order::find($data->userId)->forceDelete();
            }
            //无需判断技师是否有空预约
            //小程序用户如无则新增该用户和其宠物
            $wc;
            if (isset($data->wcId)) {
                $wc = WechatUser::find($data->wcId);
            } else {
                $wc = WechatUser::create([
                    'sessionkey' => '1',
                    'openid' => '1',
                    'code' => '1',
                    'token' => app('snowflake')->id(),
                    'nickname' => $data->wcNickname,
                    'avatar' => isset($data->wcAvatar) ? $data->wcAvatar : '',
                    'gender' => $data->wcGender,
                    'province' => isset($data->province) ? $data->province : '',
                    'city' => isset($data->city) ? $data->city : '',
                    'country' => isset($data->country) ? $data->country : '',
                    'address' => isset($data->address) ? $data->address : '',
                    'phone' => $data->phone,
                    'state' => 0,
                ]);
            }
            $pet;
            if (isset($data->petId)) {
                $pet = Pet::find($data->petId);
            } else {
                $variety = $ConfigRepository->GetOneById($data->petVarietyId);
                if (!$variety) {
                    return array(
                        'status' => 500,
                        'msg' => '无该品种信息!',
                        'data' => '');
                }

                $topvariety = $ConfigRepository->GetTopConfig($variety->id);

                $pet = Pet::create([
                    'wcId' => $wc->id,
                    'avatar' => isset($data->petAvatar) ? $data->petAvatar : '',
                    'nickname' => $data->petNickname,
                    'gender' => $data->petGender,
                    'typeId' => $topvariety->id,
                    'type' => $topvariety->value,
                    'varietyId' => $data->petVarietyId,
                    'variety' => $variety->value,
                    'birthday' => isset($data->birthday) ? $data->birthday : Carbon::now(),
                    'color' => isset($data->color) ? $data->color : "",
                    'shoulderHeight' => isset($data->shoulderHeight) ? $data->shoulderHeight : 0,
                    'is_sterilization' => 0,
                    'remark' => isset($data->petRemark) ? $data->petRemark : "",
                ]);
            }

            $user = User::find($data->userId);
            $store = Store::find($user->storeId);
            $slaveUser;
            if (isset($data->slaveUserId)) {
                $slaveUser = User::find($data->slaveUserId);
            }
            //保存主订单
            $order = Order::create([
                'orderNo' => app('snowflake')->id(),
                'wcId' => $data->wcId,
                'wcName' => $wc->nickname,
                'remark' => isset($data->remark) ? $data->remark : '',
                'petId' => $pet->id,
                'petName' => $pet->nickname,
                'petType' => $pet->type,
                'userId' => $data->userId,
                'userName' => $user->name,
                'slaveUserId' => isset($data->slaveUserId) ? $data->slaveUserId : '',
                'slaveUserName' => isset($data->slaveUserId) ? $slaveUser->name : '',
                'storeId' => $user->storeId,
                'storeName' => $store->name,
                'phone' => $wc->phone,
                'mainComboName' => $mainCombo->name,
                'serviceTime' => $allTime,
                'apptTime' => Carbon::now()->format('Y-m-d H:i'),
                'totalMoney' => $totalMoney,
                'freight' => 0,
                'payMoney' => $totalMoney,
                'payType' => 1,
                'type' => 1,
                'isOffline' => 1,
                'state' => 500,
                'payTime' => Carbon::now()->format('Y-m-d H:i'),
                'shippingTime' => Carbon::now()->format('Y-m-d H:i'),
                'beginTime' => Carbon::now()->format('Y-m-d H:i'),
                'finishTime' => Carbon::now()->format('Y-m-d H:i'),
            ]);
            //保存订单详细信息
            foreach ($combos as $combo) {
                OrderDetail::create([
                    'orderId' => $order->id,
                    'orderNo' => $order->orderNo,
                    'goodsId' => $combo->id,
                    'num' => 1,
                    'unitPrice' => $combo->salePrice,
                    'totalMoney' => $combo->salePrice,
                ]);
            }
            Db::commit(); // 提交事务
            return array(
                'status' => 200,
                'msg' => '添加信息成功!',
                'data' => '');

        } catch (\Exception $exception) {
            dd($exception);
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
        if (isset($data->userId)) {
            $orders = $orders->where('userId', $data->userId);
        }
        if (isset($data->wcId)) {
            $orders = $orders->where('wcId', $data->wcId);
        }
        if (isset($data->isOffline)) {
            $orders = $orders->where('isOffline', $data->isOffline);
        }
        if (isset($data->storeId)) {
            $orders = $orders->where('storeId', $data->storeId);
        }
        if (isset($data->state)) {
            $orders = $orders->where('state', $data->state);
        }
        if (isset($data->startDate) && isset($data->endDate)) {
            $orders = $orders->whereBetween('apptTime', [$data->startDate, $data->endDate]);
        }
        return $orders;
    }

    public function GetWorktime($data)
    {
        $worktimes = UserWorktime::where('storeId', $data->storeId);
        if (isset($data->startDate) && isset($data->endDate)) {
            $worktimes = $worktimes->where(function ($query) use ($data) {
                $query->where('workDay', '>=', $data->startDate)->where('workDay', '<=', $data->endDate);
            });
        }
        if (isset($data->workDay)) {
            $worktimes = $worktimes->where('workDay', $data->workDay);
        } else {
            $worktimes = $worktimes->where('workDay', Carbon::now()->format('Y-m-d'));
        }
        if (isset($data->workTime)) {
            $worktimes = $worktimes->where('workTime', $data->workTime);
        }
        if (isset($data->userId)) {
            $worktimes = $worktimes->where('uid', $data->userId);
        }

        return $worktimes->orderBy('workTime');
    }

    public function SetWorktime($data)
    {
        try {
            DB::beginTransaction(); // 开启事务
            $user = User::find($data->userId);
            $ConfigRepository = new ConfigRepository();
            $config = $ConfigRepository->GetOne('TimeSlot', 'TimeSlot')->first();
            foreach ($data->days as $v) {
                $day = $v['day'];
                $freq = $ConfigRepository->GetOneById($v['freqId']);
                if (!preg_match('/^[0-1][0-9]:[0-6][0-9]-[0-1][0-9]:[0-6][0-9]$/', $freq->value)) {
                    Db::rollback(); // 回滚事务
                    return array(
                        'status' => 500,
                        'msg' => $day . '日，班次有误' . $freq->value . '的格式不正确!',
                        'data' => '');
                }
                $times = explode('-', $freq->value);
                $startTime = $times[0];
                $endTime = $times[1];
                if (UserWorktime::where('workDay', $day)->where('uid', $user->id)->whereNotNull('orderId')->count() > 0) {
                    Db::rollback(); // 回滚事务
                    return array(
                        'status' => 500,
                        'msg' => '设置失败，' . $day . '日该人员已被预约不可再进行排期!',
                        'data' => '');
                }
                UserWorktime::where('workDay', $day)->where('uid', $user->id)->forceDelete();
                $st = Carbon::parse($day . ' ' . $startTime . ':00');
                $et = Carbon::parse($day . ' ' . $endTime . ':00');
                while ($et->gte($st)) {
                    UserWorktime::create(['workDay' => $st->format('Y-m-d'), 'workTime' => $st->format('H:i'),
                        'storeId' => $user->storeId, 'uid' => $user->id, 'uname' => $user->name, 'freqId' => $freq->id, 'freqName' => $freq->key]);
                    $st = $st->addMinutes($config->value);
                }
            }
            Db::commit(); // 提交事务
            return array(
                'status' => 200,
                'msg' => '设置成功!',
                'data' => '');
        } catch (\Exception $ex) {
            //dd($ex);
            Db::rollback(); // 回滚事务
            return array(
                'status' => 500,
                'msg' => '失败!' . $ex->getMessage(),
                'data' => '');
        }
    }

    //修改技师和预约时间
    public function TransferAppt($data)
    {
        try {
            $ConfigRepository = new ConfigRepository();
            $config = $ConfigRepository->GetOne('TimeSlot', 'TimeSlot')->first();
            $oldWorktimes = UserWorktime::where('orderId', $data->orderId)->get();
            $times = $oldWorktimes->count();
            DB::beginTransaction(); // 开启事务
            UserWorktime::where('orderId', $data->orderId)->update(
                ['orderId' => null, 'orderPrice' => null]
            );

            //直接获取之前预约的时间段数据
            $apptUserWorktimes = [];
            $usertimes = UserWorktime::where('workDay', $data->workDay)->where('uid', $data->userId)
                ->where('workTime', '>=', $data->workTime)->orderby('workTime')->take($times)->get();
            if ($usertimes->count() != $times) {
                return array(
                    'status' => 500,
                    'msg' => '预约失败,该技师无可预约时间!',
                    'data' => '');
            }
            for ($i = 0; $i < $times; $i++) {
                $usertime = $usertimes[$i];
                //第一个时间不是选择的时间 说明该技师在选择时间还未排班
                if ($i == 0 && $data->workTime != $usertime->workTime) {
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

            $user = User::find($data->userId);
            $slaveUser;
            if (isset($data->slaveUserId)) {
                $slaveUser = User::find($data->slaveUserId);
            }
            // $store = Store::find($data->storeId);
            //修改主订单
            $order = Order::find($data->orderId);
            $order->userId = $data->userId;
            $order->userName = $user->name;
            $order->slaveUserId = isset($data->slaveUserId) ? $data->slaveUserId : '';
            $order->slaveUserName = isset($data->slaveUserId) ? $slaveUser->name : '';
            $order->apptTime = $data->workDay . $apptUserWorktimes[0]->workTime;

            //保存用户预约信息
            for ($i = 0; $i < $times; $i++) {
                $usertime = $apptUserWorktimes[$i];
                $usertime->orderId = $order->id;
                if ($i == 0) {
                    $usertime->orderPrice = $order->totalMoney;
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

    //查询技师总排版情况
    public function GetStatsWorktime($data)
    {
        $user = DB::table('users')->where('users.storeId', $data->storeId)->where('isBeautician', 1);
        $worktimes = $user->leftJoin('userworktimes', function ($join) use ($data) {
            $join->on('users.id', '=', 'userworktimes.uid')
                ->where('userworktimes.storeId', '=', $data->storeId)
                ->whereNull('userworktimes.deleted_at');

            if (isset($data->startDate) && isset($data->endDate)) {
                $join = $join->where(function ($query) use ($data) {
                    $query->where('workDay', '>=', $data->startDate)->where('workDay', '<=', $data->endDate);
                });
            }
            if (isset($data->workDay)) {
                $join = $join->where('workDay', $data->workDay);
            } else {
                $join = $join->where('workDay', '>', Carbon::now()->format('Y-m-d'));
            }
        });
        if (isset($data->userId)) {
            $worktimes = $worktimes->where('users.id', $data->userId);
        }
        $worktimes = $worktimes->groupBy('users.id', 'users.name', 'post', 'workDay', 'freqId', 'freqName')
            ->select(DB::raw('users.id as uid'), DB::raw('users.name as uname'), 'post', 'workDay', 'freqId', 'freqName', DB::raw('CONCAT(min(workTime),\'-\',max(workTime)) as times'));

        return $worktimes;
    }

    //修改状态
    public function ChangeState($data)
    {
        $order = Order::find($data->orderId);
        if ($data->state == 300 && $order->state == 200) {
            $order->state = 300;
            $order->beginTime = Carbon::now();
            $order->save();
            return array(
                'status' => 200,
                'msg' => '操作成功!',
                'data' => '');
        } else if ($data->state == 400 && $order->state == 300) {
            $order->state = 400;
            $order->shippingTime = Carbon::now();
            $order->save();
            return array(
                'status' => 200,
                'msg' => '操作成功!',
                'data' => '');
        } else if ($data->state == 500 && $order->state == 400) {
            $order->state = 500;
            $order->finishTime = Carbon::now();
            $order->save();
            return array(
                'status' => 200,
                'msg' => '操作成功!',
                'data' => '');
        } else {
            return array(
                'status' => 200,
                'msg' => '失败，订单状态不正确!',
                'data' => '');
        }
    }

    //预约技师添加备注
    public function AddUserRemark($data)
    {
        $order = Order::find($data->orderId);
        if ($order->state == 200 || $order->state == 300) {
            $order->userRemark = $data->userRemark;
            $order->save();
            return array(
                'status' => 200,
                'msg' => '操作成功!',
                'data' => '');
        } else {
            return array(
                'status' => 200,
                'msg' => '失败，订单状态不正确!',
                'data' => '');
        }
    }
    //预约单店铺添加备注
    public function AddStoreRemark($data)
    {
        $order = Order::find($data->orderId);
        if ($order->state == 200 || $order->state == 300) {
            $order->storeRemark = $data->storeRemark;
            $order->save();
            return array(
                'status' => 200,
                'msg' => '操作成功!',
                'data' => '');
        } else {
            return array(
                'status' => 200,
                'msg' => '失败，订单状态不正确!',
                'data' => '');
        }
    }
    //支付后更新状态
    public function Paid($data)
    {
        $payRepository = new PayRepository();
        $result = $payRepository->Paid($data);
        //成功
        if ($result->status == 200) {
            try {
                $orderDetails = OrderDetail::where('orderId', $data->orderId);
                foreach ($orderDetails as $v) {
                    $combo = Combo::find($v->goodsId);
                    $combo->increment('sales');
                }
                return array(
                    'status' => 200,
                    'msg' => '支付成功!',
                    'data' => '');
            } catch (\Exception $exception) {
                // dd($exception);
                Db::rollback(); // 回滚事务
                Log::warning($data->orderId . '订单商品销量增加错误出现' . $exception->getMessage());
            }
        } else {
            return $result;
        }

    }

    //退款
    public function Refund($data)
    {
        //预约无需审核，操作创建退款记录 直接退款
        $order = Order::find($data->orderId);
        $refund = OrderRefund::where('orderId', $data->orderId)->first();
        if (!$refund) {
            $refund = OrderRefund::create([
                'orderId' => $order->id,
                'refundNo' => app('snowflake')->id(),
                'wcId' => $order->wcId,
                'wcName' => $order->wcName,
                'type' => 1, //售后类型1仅退款2退货退款
                'money' => $order->payMoney,
                'reason' => $data->reason,
                'images' => isset($data->images) ? $data->images : '',
                'state' => 0,
                'userId' => $data->userId,
                'userName' => $data->userName,
                'examineDate' => Carbon::now(),
            ]);
        }

        $result = $payRepository->Refund($data);
        if ($result->status == 200) {
            try {
                $refund->state = 300;
                $refund->save();
                $order->state = 502;
                $order->save();
                $orderDetails = OrderDetail::where('orderId', $data->orderId);
                foreach ($orderDetails as $v) {
                    $combo = Combo::find($v->goodsId);
                    $combo->decrement('sales');
                }
                return array(
                    'status' => 200,
                    'msg' => '退款成功!',
                    'data' => '');
            } catch (\Exception $exception) {
                // dd($exception);
                Db::rollback(); // 回滚事务
                Log::warning($data->orderId . '订单商品扣减销量错误出现' . $exception->getMessage());
            }
        } else {
            return $result;
        }
    }
}
