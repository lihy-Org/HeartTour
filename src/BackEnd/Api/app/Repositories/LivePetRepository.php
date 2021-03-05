<?php
namespace App\Repositories;

use App\Models\GoodsDetail;
use App\Models\LivePet;
use App\Models\LivePetCertificate;
use App\Repositories\ConfigRepository;
use Illuminate\Support\Facades\DB;

class LivePetRepository
{

    public function AddOrUpdate($data)
    {
        $ConfigRepository = new ConfigRepository();
        $live = null;
        if (isset($data->liveId)) {
            $live = LivePet::find($data->liveId);
        }
        if (!$live) {
            try {
                $type = $ConfigRepository->GetOneById($data->typeId);
                $variety = $ConfigRepository->GetOneById($data->varietyId);
                DB::beginTransaction(); // 开启事务
                $live = LivePet::create([
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
                    LivePetCertificate::create(['gid' => $live->id, 'url' => $v]);
                }
                //保存套餐详细图
                foreach ($data->detailImgs as $v) {
                    GoodsDetail::create(['gid' => $live->id, 'url' => $v]);
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
                $live->typeId = $type->id;
                $live->typeName = $type->value;
                $live->gender = $data->gender;
                $live->vaccine = $data->vaccine;
                $live->number = $data->number;
                $live->color = $data->color;
                $live->varietyId = $variety->id;
                $live->variety = $variety->value;
                $live->originPrice = $data->originPrice;
                $live->salePrice = $data->salePrice;
                $live->age = $data->age;
                $live->shoulderHeight = $data->shoulderHeight;
                $live->note = $data->note;
                $live->avatar = $data->avatar;
                $live->save();
                LivePetCertificate::where('gid', $live->id)->delete();
                GoodsDetail::where('gid', $live->id)->delete();
                //保存证书
                foreach ($data->certificates as $v) {
                    LivePetCertificate::create(['gid' => $live->id, 'url' => $v]);
                }
                //保存套餐详细图
                foreach ($data->detailImgs as $v) {
                    GoodsDetail::create(['gid' => $live->id, 'url' => $v]);
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
        $live = LivePet::orderBy('created_at');
        if (isset($data->searchKey)) {
            $live = $live->where(function ($query) use ($data) {
                $query->where('number', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('variety', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('note', 'like', '%' . $data->searchKey . '%');
            });
        }
        if (isset($data->state)) {
            $live = $live->where('state', $data->state);
        }
        if (isset($data->typeId)) {
            $live = $live->where('typeId', $data->typeId);
        }
        if (isset($data->varietyId)) {
            $live = $live->where('varietyId', $data->varietyId);
        }
        return $live;
    }

    public function Remove($liveId)
    {
        $live = LivePet::find($liveId);
        $state = 2;
        if ($live) {
            if ($live->state == 0) {
                $state = 1;
            }

            if ($live->state == 1) {
                $state = 2;
            }

            if ($live->state == 2) {
                $state = 1;
            }

            $live->state = $state;
            $live->save();
            return array(
                'status' => 200,
                'msg' => '操作成功!',
                'data' => '');
        }
        return array(
            'status' => 500,
            'msg' => '操作失败,找不到该活体!',
            'data' => '');

    }
}
