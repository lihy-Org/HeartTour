<?php
namespace App\Repositories;

use App\Models\Combo;
use App\Models\ComboBeautician;
use App\Models\ComboVariety;
use App\Models\GoodsBanner;
use App\Models\GoodsDetail;
use App\Models\User;
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
        $combo = Combo::with(array('Varietys' => function ($query) {
            $query->select('id', 'cid', 'varietyId', 'variety');
        }, 'Users' => function ($query) {
            $query->select('id', 'cid', 'userId', 'userName');
        }))->orderBy('created_at');
        if (isset($data->searchKey)) {
            $combo = $combo->where(function ($query) use ($data) {
                $query->where('name', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('desc', 'like', '%' . $data->searchKey . '%');
            });
        }
        if (isset($data->state)) {
            $combo = $combo->where('state', $data->state);
        }
        if (isset($data->comboType)) {
            $combo = $combo->where('comboType', $data->comboType);
        }
        if (isset($data->storeId)) {
            $combo = $combo->whereIn('id', function ($query) use ($data) {
                $query->select('cid')
                    ->from('comboBeauticians')
                    ->whereNull('deleted_at')
                    ->whereIn('userId', function ($query) use ($data) {
                        $query->select('id')
                            ->from('users')
                            ->whereNull('deleted_at')
                            ->where('storeId', $data->storeId);
                    });
            });
        }
        if (isset($data->varietyId)) {
            $combo = $combo->whereIn('id', function ($query) use ($data) {
                $query->select('cid')
                    ->from('comboVarieties')
                    ->whereNull('deleted_at')
                    ->where('varietyId', $data->varietyId);
            });
        }
        return $combo;
    }

    public function Remove($comboId)
    {
        $combo = Combo::find($comboId);
        $state = 2;
        if ($combo) {
            if ($combo->state == 0) {
                $state = 1;
            }

            if ($combo->state == 1) {
                $state = 2;
            }

            if ($combo->state == 2) {
                $state = 1;
            }

            $combo->state = $state;
            $combo->save();
            return array(
                'status' => 200,
                'msg' => '操作成功!',
                'data' => '');
        }
        return array(
            'status' => 500,
            'msg' => '操作失败,找不到该套餐!',
            'data' => '');

    }

    public function SetBeautician($data)
    {
        try {
            $combo = Combo::find($data->comboId);
            DB::beginTransaction(); // 开启事务
            ComboBeautician::where('cid', $data->comboId)->delete();
            if (isset($data->userIds)) {
                foreach (array_unique($data->userIds) as $v) {
                    $user = User::find($v);
                    ComboBeautician::create(['cid' => $combo->id, 'cname' => $combo->name, 'userId' => $user->id, 'userName' => $user->name]);
                }
            }
            Db::commit(); // 提交事务
            return array(
                'status' => 200,
                'msg' => '设置成功!',
                'data' => '');
        } catch (\Exception $ex) {
            dd($ex);
            Db::rollback(); // 回滚事务
            return array(
                'status' => 500,
                'msg' => '失败!' . $ex->getMessage(),
                'data' => '');
        }
    }
}
