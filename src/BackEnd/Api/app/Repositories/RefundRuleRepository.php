<?php
namespace App\Repositories;

use App\Models\RefundRule;

class RefundRuleRepository
{

    public function AddOrUpdate($data)
    {
        $refundRule = null;
        if (isset($data->refundRuleId)) {
            $refundRule = RefundRule::find($data->refundRuleId);
        }
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
        
    public function GetCantRefundConfig()
    {
        $refundRules = RefundRule::where('rate', '101')->first();
        return $refundRules;
    }
}
