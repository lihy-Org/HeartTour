<?php
namespace App\Repositories;

use App\Models\Pet;
use App\Repositories\ConfigRepository;
use Carbon\Carbon;

class PetRepository
{

    public function AddOrUpdate($data)
    {
        $ConfigRepository = new ConfigRepository();
        $pet=null;
        if (isset($data->petId)) {
            $pet = Pet::find($data->petId);
        }
        if (!$pet) {
            try {
                $variety = $ConfigRepository->GetOneById($data->varietyId);
                if (!$variety) {
                    return array(
                        'status' => 500,
                        'msg' => '无该品种信息!',
                        'data' => '');
                }
                $topvariety = $ConfigRepository->GetTopConfig($variety->id);
                $pet = Pet::create([
                    'wcId' => $data->wcId,
                    'avatar' => isset($data->avatar) ? $data->avatar : "",
                    'nickname' => $data->nickname,
                    'gender' => $data->gender,
                    'typeId' => $topvariety->id,
                    'type' => $topvariety->value,
                    'varietyId' => $data->varietyId,
                    'variety' => $variety->value,
                    'birthday' => isset($data->birthday) ? $data->birthday : Carbon::now()->format('y-m-d'),
                    'color' => isset($data->color) ? $data->color : "",
                    'shoulderHeight' => isset($data->shoulderHeight) ? $data->shoulderHeight : 0,
                    'is_sterilization' => 0,
                    'remark' => isset($data->remark) ? $data->remark : "",
                ]);
                return array(
                    'status' => 200,
                    'msg' => '添加信息成功!',
                    'data' => '');

            } catch (\Exception $exception) {
                return array(
                    'status' => 500,
                    'msg' => '保存失败!' . $exception->getMessage(),
                    'data' => '');
            }
        } else {
            try {
                $variety = $ConfigRepository->GetOneById($data->varietyId);
                if (!$variety) {
                    return array(
                        'status' => 500,
                        'msg' => '无该品种信息!',
                        'data' => '');
                }
                $pet->avatar = isset($data->avatar) ? $data->avatar : "";
                $pet->nickname = $data->nickname;
                $pet->gender = $data->gender;
                $pet->varietyId = $data->varietyId;
                $pet->variety = $variety->value;
                $pet->birthday = isset($data->birthday) ? $data->birthday : "";
                $pet->color = isset($data->color) ? $data->color : "";
                $pet->shoulderHeight = isset($data->shoulderHeight) ? $data->shoulderHeight : 0;
                $pet->remark = isset($data->remark) ? $data->remark : "";
                $pet->save();
                return array(
                    'status' => 200,
                    'msg' => '添加信息成功!',
                    'data' => '');
            } catch (\Throwable $exception) {
                //dd($exception);
                return array(
                    'status' => 500,
                    'msg' => '保存失败!' . $exception->getMessage(),
                    'data' => '');
            }
        }
    }

    public function GetList($data)
    {
        $pets = Pet::orderBy('created_at');
        if (isset($data->searchKey)) {
            $pets = $pets->where(function ($query) use ($data) {
                $query->where('nickname', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('variety', 'like', '%' . $data->searchKey . '%');
            });
        }  
        if (isset($data->wcId)) {
            $pets = $pets->where('wcId', $data->wcId);
        }
        if (isset($data->varietyId)) {
            $pets = $pets->where('varietyId', $data->varietyId);
        }
        if (isset($data->gender)) {
            $pets = $pets->where('gender', $data->gender);
        }
      
        return $pets;
    }

    public function GetOne($data)
    {
        return Pet::where('wcId', $data->wcId)->where('id', $data->petId);
    }

    public function Remove($data)
    {
        $pet = Pet::where('wcId', $data->wcId)->where('id', $data->petId)->first();
        if ($pet) {
            $pet->delete();
            return array(
                'status' => 200,
                'msg' => '操作成功!',
                'data' => '');
        }
        return array(
            'status' => 500,
            'msg' => '操作失败，找不到数据!',
            'data' => '');

    }
}
