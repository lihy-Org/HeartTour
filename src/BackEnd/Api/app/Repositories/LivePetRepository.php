<?php
namespace App\Repositories;

use App\Models\GoodsDetail;
use App\Models\LivePet;
use App\Models\User;
use App\Repositories\ConfigRepository;
use Illuminate\Support\Facades\DB;

class LivePetRepository
{

    public function AddOrUpdate($data)
    {
        $ConfigRepository = new ConfigRepository();
        $lpet = null;
        if (isset($data->lpetId)) {
            $lpet = LivePet::find($data->lpetId);
        }
        if (!$lpet) {
            try {
                $type = $ConfigRepository->GetOneById($data->typeId);
                $variety = $ConfigRepository->GetOneById($data->varietyId);
                DB::beginTransaction(); // 开启事务
                $lpet = LivePet::create([
                    'typeId' => $type->id,
                    'typeName' => $type->value,
                    'gender' => $data->gender,
                    'vaccine' => $data->vaccine,
                    'number' => $data->number,
                    'color' => $data->color,
                    'varietyId' => $variety->id,
                    'variety' => $variety->value,
                    'originPrice' => $data->originPrice,
                    'salePrice' => $data->salePrice,
                    'age' => $data->age,
                    'shoulderHeight' => $data->shoulderHeight,
                    'note' => $data->note,
                    'avatar' => $data->avatar,
                    'state' => 0,
                ]);

                //保存证书
                foreach ($data->certificates as $v) {
                    LivePetCertificate::create(['gid' => $combo->id, 'url' => $v]);
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
                $type = $ConfigRepository->GetOneById($data->typeId);
                $variety = $ConfigRepository->GetOneById($data->varietyId);
                DB::beginTransaction(); // 开启事务
                $lpet->typeId = $type->id;
                $lpet->typeName = $type->value;
                $lpet->gender = $data->gender;
                $lpet->vaccine = $data->vaccine;
                $lpet->number = $data->number;
                $lpet->color = $data->color;
                $lpet->varietyId = $variety->id;
                $lpet->variety = $variety->value;
                $lpet->originPrice = $data->originPrice;
                $lpet->salePrice = $data->salePrice;
                $lpet->age = $data->age;
                $lpet->shoulderHeight = $data->shoulderHeight;
                $lpet->note = $data->note;
                $lpet->avatar = $data->avatar;
                $lpet->save();
                LivePetCertificate::where('gid', $lpet->id)->delete();
                GoodsDetail::where('gid', $lpet->id)->delete();
                //保存证书
                foreach ($data->certificates as $v) {
                    LivePetCertificate::create(['gid' => $lpet->id, 'url' => $v]);
                }
                //保存套餐详细图
                foreach ($data->detailImgs as $v) {
                    GoodsDetail::create(['gid' => $lpet->id, 'url' => $v]);
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
                    ->whereIn('userId', function ($query) use ($data) {
                        $query->select('id')
                            ->from('users')
                            ->where('storeId', $data->storeId);
                    });
            });
        }
        if (isset($data->varietyId)) {
            $combo = $combo->whereIn('id', function ($query) use ($data) {
                $query->select('cid')
                    ->from('comboVarieties')
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
