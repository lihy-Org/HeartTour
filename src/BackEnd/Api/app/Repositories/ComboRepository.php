<?php
namespace App\Repositories;

use App\Models\Combo;
use App\Models\ComboVariety;
use App\Models\GoodsBanner;
use App\Models\GoodsDetail;
use App\Repositories\ConfigRepository;
use Illuminate\Support\Facades\DB;

class ComboRepository
{

    public function AddOrUpdate($data)
    {
        $ConfigRepository = new ConfigRepository();
        $combo = null;
        if (isset($data->comboId)) {
            $combo = Combo::find($data->comboId);
        }
        if (!$combo) {
            try {
                DB::beginTransaction(); // 开启事务
                $combo = Combo::create([
                    'comboType' => $data->comboType,
                    'name' => $data->name,
                    'desc' => $data->desc,
                    'originPrice' => $data->originPrice,
                    'salePrice' => $data->salePrice,
                    'nursingTime' => $data->nursingTime,
                    'bgImg' => $data->bgImg,
                    'sales' => 0,
                    'state' => 0,
                ]);

                //保存套餐适配品种
                if (isset($data->varietyIds)) {
                    foreach ($data->varietyIds as $v) {
                        $variety = $ConfigRepository->GetOneById($v);
                        if (!$variety) {
                            Db::rollback(); // 回滚事务
                            return array(
                                'status' => 500,
                                'msg' => '找不到' . $v . '品种信息!',
                                'data' => '');
                        }
                        ComboVariety::create(['cid' => $combo->id, 'varietyId' => $variety->id, 'variety' => $variety->value]);
                    }
                }
                //保存套餐baner图
                foreach ($data->bannerImgs as $v) {
                    GoodsBanner::create(['gid' => $combo->id, 'url' => $v]);
                }
                //保存套餐详细图
                foreach ($data->detailImgs as $v) {
                    GoodsDetail::create(['gid' => $combo->id, 'url' => $v]);
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
                    'msg' => '保存失败!',
                    'data' => '');
            }
        } else {
            try {
                DB::beginTransaction(); // 开启事务 
                $combo->comboType = $data->comboType;
                $combo->name = $data->name;
                $combo->desc = $data->desc;
                $combo->originPrice = $data->originPrice;
                $combo->salePrice = $data->salePrice;
                $combo->nursingTime = $data->nursingTime;
                $combo->bgImg = $data->bgImg;
                $combo->save();
                ComboVariety::where('cid', $combo->id)->delete();
                GoodsBanner::where('gid', $combo->id)->delete();
                GoodsDetail::where('gid', $combo->id)->delete();
                 //保存套餐适配品种
                 if (isset($data->varietyIds)) {
                    foreach ($data->varietyIds as $v) {
                        $variety = $ConfigRepository->GetOneById($v);
                        if (!$variety) {
                            Db::rollback(); // 回滚事务
                            return array(
                                'status' => 500,
                                'msg' => '找不到' . $v . '品种信息!',
                                'data' => '');
                        }
                        ComboVariety::create(['cid' => $combo->id, 'varietyId' => $variety->id, 'variety' => $variety->value]);
                    }
                }
                //保存套餐baner图
                foreach ($data->bannerImgs as $v) {
                    GoodsBanner::create(['gid' => $combo->id, 'url' => $v]);
                }
                //保存套餐详细图
                foreach ($data->detailImgs as $v) {
                    GoodsDetail::create(['gid' => $combo->id, 'url' => $v]);
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
        $users = User::where('state', 0)->whereNotIn('type', [0, 1])->orderBy('created_at');
        if (isset($data->searchKey)) {
            $users = $users->where(function ($query) use ($data) {
                $query->where('name', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('phone', 'like', '%' . $data->searchKey . '%');
            });
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
}
