<?php
namespace App\Repositories;

use App\Models\RefundRule;

class RefundRuleRepository
{

    public function AddOrUpdate($data)
    {
        $refundRule = null;
        if (isset($data->rId)) {
            $refundRule = RefundRule::find($data->rId);
            if (RefundRule::whereRaw('(minMin < ' . $data->minMin . ' and maxMin > ' . $data->minMin .
                ') or (minMin < ' . $data->maxMin . ' and maxMin >' . $data->maxMin . ' )')->where('id', '!=', $data->rId)->first() ||
                RefundRule::where('minMin', $data->minMin)->where('maxMin', $data->maxMin)->where('id', '!=', $data->rId)->first() ||
                RefundRule::where('minMin', '>=', $data->minMin)->where('maxMin', '<=', $data->maxMin)->where('id', '!=', $data->rId)->first()
            ) {
                return array(
                    'status' => 500,
                    'msg' => '已存在该时间段配置，请检查后再行添加！',
                    'data' => '');
            }

        } elseif ($data->rate == 101) {
            $refundRule = RefundRule::where('rate', '101')->first();
            if (RefundRule::whereRaw('(minMin < ' . $data->minMin . ' and maxMin > ' . $data->minMin .
                ') or (minMin < ' . $data->maxMin . ' and maxMin >' . $data->maxMin . ' )')->where('rate', '!=', 101)->first() ||
                RefundRule::where('minMin', $data->minMin)->where('maxMin', $data->maxMin)->where('rate', '!=', 101)->first() ||
                RefundRule::where('minMin', '>=', $data->minMin)->where('maxMin', '<=', $data->maxMin)->where('rate', '!=', 101)->first()
            ) {
                return array(
                    'status' => 500,
                    'msg' => '已存在该时间段配置，请检查后再行添加！',
                    'data' => '');
            }
        } else {
            if (RefundRule::whereRaw('(minMin < ' . $data->minMin . ' and maxMin > ' . $data->minMin .
                ') or (minMin < ' . $data->maxMin . ' and maxMin >' . $data->maxMin . ' )')->first() ||
                RefundRule::where('minMin', $data->minMin)->where('maxMin', $data->maxMin)->first() ||
                RefundRule::where('minMin', '>=', $data->minMin)->where('maxMin', '<=', $data->maxMin)->first()
            ) {
                return array(
                    'status' => 500,
                    'msg' => '已存在该时间段配置，请检查后再行添加！',
                    'data' => '');
            }
        }
        //档次不能有包含关系，例如已存在0-30 则不能添加一个20-40

        if (!$refundRule) {
            try {
                $refundRule = RefundRule::create([
                    'minMin' => $data->minMin,
                    'maxMin' => $data->maxMin,
                    'rate' => $data->rate,
                ]);
                return array(
                    'status' => 200,
                    'msg' => '添加信息成功!',
                    'data' => '');

            } catch (\Exception $ex) {
                return array(
                    'status' => 500,
                    'msg' => '保存失败!' . $ex->getMessage(),
                    'data' => '');
            }
        } else {
            try {
                $refundRule->minMin = $data->minMin;
                $refundRule->maxMin = $data->maxMin;
                $refundRule->rate = $data->rate;
                $refundRule->save();
                return array(
                    'status' => 200,
                    'msg' => '添加信息成功!',
                    'data' => '');
            } catch (\Exception $ex) {
                return array(
                    'status' => 500,
                    'msg' => '保存失败!' . $ex->getMessage(),
                    'data' => '');
            }
        }
    }

    public function GetList()
    {
        $refundRules = RefundRule::where('rate', '!=', '101')->orderBy('minMin');
        return $refundRules;
    }

    public function GetLimit()
    {
        $refundRules = RefundRule::where('rate', '101');
        return $refundRules;
    }

    public function Remove($rId)
    {
        $refundRules = RefundRule::find($rId);
        if ($refundRules) {
            $refundRules->delete();
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
