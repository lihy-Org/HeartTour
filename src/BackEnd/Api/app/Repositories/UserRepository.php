<?php
namespace App\Repositories;

use App\Models\Store;
use App\Models\User;
use App\Models\UserKpi;
use App\Models\UserTitle;
use App\Repositories\ConfigRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserRepository
{

    public function AddOrUpdate($data)
    {
        $ConfigRepository = new ConfigRepository();
        $user = null;
        if (isset($data->userId)) {
            $user = User::find($data->userId);
        }
        if (!$user) {
            try {
                DB::beginTransaction(); // 开启事务
                $post = $ConfigRepository->GetOneById($data->postId);
                if (!$post) {
                    return array(
                        'status' => 500,
                        'msg' => '无该职位信息!',
                        'data' => '');
                }
                $user = User::create([
                    'name' => $data->name,
                    'phone' => $data->phone,
                    'avatar' => $data->avatar,
                    'gender' => $data->gender,
                    'age' => $data->age,
                    'postId' => $data->postId,
                    'post' => $post->value,
                    'isBeautician' => isset($data->isBeautician) ? $data->isBeautician : 0,
                    'type' => 3,
                    'state' => 0,
                ]);
                if (isset($data->titleIds)) {
                    foreach ($data->titleIds as $v) {
                        $title = $ConfigRepository->GetOneById($v);
                        if (!$title) {
                            Db::rollback(); // 回滚事务
                            return array(
                                'status' => 500,
                                'msg' => '无该头衔信息!',
                                'data' => '');
                        }
                        UserTitle::create(['uid' => $user->id, 'titleId' => $title->id, 'title' => $title->value]);
                    }
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
                    'msg' => '保存失败!',
                    'data' => '');
            }
        } else {
            try {
                DB::beginTransaction(); // 开启事务
                $post = $ConfigRepository->GetOneById($data->postId);
                if (!$post) {
                    return array(
                        'status' => 500,
                        'msg' => '无该职位信息!',
                        'data' => '');
                }
                $user->name = $data->name;
                $user->phone = $data->phone;
                $user->avatar = $data->avatar;
                $user->gender = $data->gender;
                $user->age = $data->age;
                $user->postId = $data->postId;
                $user->post = $post->value;
                $user->isBeautician = isset($data->isBeautician) ? $data->isBeautician : 0;
                $user->save();
                UserTitle::where('uid', $user->id)->delete();
                if (isset($data->titleIds)) {
                    foreach ($data->titleIds as $k => $v) {
                        $title = $ConfigRepository->GetOneById($v);
                        if (!$title) {
                            Db::rollback(); // 回滚事务
                            return array(
                                'status' => 500,
                                'msg' => '无该头衔信息!',
                                'data' => '');
                        }
                        UserTitle::create(['uid' => $user->id, 'titleId' => $title->id, 'title' => $title->value]);
                    }
                }
                Db::commit(); // 提交事务
                return array(
                    'status' => 200,
                    'msg' => '添加信息成功!',
                    'data' => '');
            } catch (\Throwable $th) {
                Db::rollback(); // 回滚事务
                return array(
                    'status' => 500,
                    'msg' => '保存失败!',
                    'data' => '');
            }
        }
    }

    public function GetList($data)
    {
        $users = User::where('state', 0)->with(array('Titles' => function ($query) {
            $query->select('id', 'uid', 'titleId', 'title');
        }))->whereNotIn('type', [0, 1])->orderBy('created_at');
        if (isset($data->searchKey)) {
            $users = $users->where(function ($query) use ($data) {
                $query->where('name', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('phone', 'like', '%' . $data->searchKey . '%');
            });
        }
        if (isset($data->isDist) && $data->isDist == 1) {
            $users = $users->where(function ($query) use ($data) {
                $query->where('type', 3)
                    ->orWhere('type', 4)
                    ->orWhere('type', 5);
            });
        } else {
            $users = $users->where(function ($query) use ($data) {
                $query->where('type', 2)
                    ->orWhere('type', 3);
            });
        }
        if (isset($data->type)) {
            $users = $users->where('type', $data->type);
        }
        if (isset($data->storeId)) {
            $users = $users->where('storeId', $data->storeId);
        }
        if (isset($data->postId)) {
            $users = $users->where('postId', $data->postId);
        }
        if (isset($data->gender)) {
            $users = $users->where('gender', $data->gender);
        }
        return $users;
    }

    //获取个人信息
    public function GetInfo($userId)
    {
        return User::where('state', 0)->with(array('Titles' => function ($query) {
            $query->select('id', 'uid', 'titleId', 'title');
        }))->whereNotIn('type', [0, 1])->where('id', $userId)->first();
    }

    //获取个人kpi
    public function GetKpi($userId)
    {
        $user = DB::table('users')->where('users.id', $userId);
        $kpis = $user->leftJoin('userkpis', function ($join) {
            $join->on('users.id', '=', 'userkpis.userId')
                ->on('users.storeId', '=', 'userkpis.storeId')
                ->whereNull('userkpis.deleted_at');
        });
        $kpis = $kpis->leftJoin(DB::raw('(select userId,ifnull(sum(payMoney),0) money from orders where state=500 and type=1 and userId=\'' . $userId .
            '\' and  DATE_FORMAT(finishTime, \'%Y%m\') = DATE_FORMAT(CURDATE() , \'%Y%m\')) done'),
            function ($join) {
                $join->on('users.id', '=', 'done.userId');
            });
        $kpis = $kpis->where('month', Carbon::now()->format('Y-m'))->select('kpi',DB::raw('ifnull(done.money,0) as finished'),DB::raw('kpi-ifnull(done.money,0) as needs')
        ,DB::raw('convert((kpi-ifnull(done.money,0))/DATEDIFF(DATE_FORMAT(ADDDATE(CURDATE(),INTERVAL \'1\' MONTH),\'%Y-%m-01\'),CURDATE())-1,decimal(15,2)) AS dailykpi'));

        return $kpis->first();
    }
    public function Remove($userId)
    {
        $user = User::find($userId);
        if ($user) {
            $user->state = 1;
            $user->save();
            UserTitle::where('uid', $userId)->delete();
            return array(
                'status' => 200,
                'msg' => '删除成功!',
                'data' => '');
        }
        return array(
            'status' => 500,
            'msg' => '删除失败,找不到该人员!',
            'data' => '');

    }

    public function SetStore($data)
    {
        try {
            DB::beginTransaction(); // 开启事务
            $store = Store::find($data->storeId);
            $user = User::find($data->userId);
            $user->storeId = $store->id;
            $user->store = $store->name;
            $user->save();
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

    public function SetStoreManage($data)
    {
        try {
            DB::beginTransaction(); // 开启事务
            $user = User::find($data->userId);
            $store = Store::find($user->storeId);
            //禁用此前的店长
            $dUser = User::where('storeId', $user->storeId)->where('type', 2)->get();
            foreach ($dUser as $v) {
                $v->type = 3;
                $v->save();
            }
            $user->type = 2;
            $user->save();
            $store->shopManagerId = $user->id;
            $store->shopManager = $user->name;
            $store->save();
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

    public function GetSelectList()
    {
        return User::where('state', 0)->where('isBeautician', 1)->select('id', 'name');
    }

    public function SetType($data)
    {
        $user = User::find($data->userId);
        if ($user) {
            $user->type = $data->type;
            $user->lastdist = Carbon::now();
            $user->save();
            return array(
                'status' => 200,
                'msg' => '修改成功!',
                'data' => '');
        }
        return array(
            'status' => 500,
            'msg' => '修改失败,找不到该人员!',
            'data' => '');
    }

    public function SetKpi($data)
    {
        $kpi = UserKpi::where('userId', $data->userId)->where('month', $data->month);
        try {
            DB::beginTransaction(); // 开启事务

            if ($kpi) {
                $kpi->delete();
            }
            $user = User::find($data->userId);
            UserKpi::create([
                'storeId' => $data->storeId,
                'userId' => $data->userId,
                'userName' => $user->name,
                'month' => $data->month,
                'kpi' => $data->kpi,
                'setId' => $data->setId,
                'setName' => $data->setName,
            ]);
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

    public function GetKpiList($data)
    {
        $user = DB::table('users')->where('isBeautician', 1);
        if (isset($data->storeId)) {
            $user = $user->where('users.storeId', $data->storeId);
        }
        if (isset($data->userId)) {
            $user = $user->where('users.id', $data->userId);
        }
        if (isset($data->searchKey)) {
            $user = $user->where(function ($query) use ($data) {
                $query->where('name', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('phone', 'like', '%' . $data->searchKey . '%');
            });
        }
        $kpis = $user->leftJoin('userkpis', function ($join) use ($data) {
            $join->on('users.id', '=', 'userkpis.userId')
                ->on('users.storeId', '=', 'userkpis.storeId')
                ->whereNull('userkpis.deleted_at');
            if (isset($data->month)) {
                $join = $join->where('month', $data->month);
            }
        });
        $kpis = $kpis->orderBy('users.id')->orderBy('month')->select(DB::raw('users.id as userId'), DB::raw('users.name as userName'), 'post', 'month', 'kpi');

        return $kpis;
    }

}
