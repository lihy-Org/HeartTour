<?php
namespace App\Repositories;

use App\Models\Order;
use App\Models\OrderRefund;

class PayRepository
{

    public function Pay($data)
    {
        try {
            $order = Order::find($data->orderId);
            $payment = \EasyWeChat::payment(); // 微信支付实例
            $result = $payment->order->unify([
                'body' => $order->orderNo,
                'out_trade_no' => $order->orderNo,
                'total_fee' => bcmul($data, 100),
                'trade_type' => 'JSAPI', // 请对应换成你的支付方式对应的值类型
                'openid' => $data->openid,
            ]);
            if ($result['result_code'] == 'SUCCESS' && $result['return_code'] == 'SUCCESS') {
                $prepayId = $result['prepay_id'];
                $jssdk = $payment->jssdk;
                $config = $jssdk->sdkConfig($prepayId);
                $config['timeStamp'] = $config['timestamp'];
                unset($config['appId']);
                unset($config['timestamp']);
            }
            return array(
                'status' => 200,
                'msg' => '签名成功!',
                'data' => $config);

        } catch (\Exception $exception) {
            // dd($exception);
            return array(
                'status' => 500,
                'msg' => '签名失败!' . $exception->getMessage(),
                'data' => '');
        }
    }

    public function Paid($data)
    {
        $order = Order::find($data->orderId);
        if ($order->state == 100) {
            //check 微信支付
            $payment = \EasyWeChat::payment();
            $wpay = $payment->order->queryByOutTradeNumber($order->orderNo);
            if ($wpay['result_code'] == "SUCCESS" || $wpay->payMoney == 0) {
                $order->state = 200;
                $order->payTime = Carbon::now();
                $order->save();
                return array(
                    'status' => 200,
                    'msg' => '支付成功!',
                    'data' => '');
            } else {
                return array(
                    'status' => 500,
                    'msg' => '支付失败!',
                    'data' => '');
            }
        } else {
            return array(
                'status' => 500,
                'msg' => '订单已支付!',
                'data' => '');
        }
    }

    public function Refund($data)
    {
        $order = Order::find($data->orderId);
        $payment = \EasyWeChat::payment(); // 微信支付实例
        $refund = OrderRefund::where('orderId', $data->orderId)->first();
        if ($refund) {
            $result = $payment->refund->byOutTradeNumber($order->orderNo, $refund->refundNo, bcmul($order->payMoney, 100), bcmul($refund->money, 100), []);
            if ($result['return_code'] == "FAIL") {
                return array(
                    'status' => 500,
                    'msg' => '发起退款失败，请联系客服!',
                    'data' => '',
                );
            } else {
                return array(
                    'status' => 200,
                    'msg' => '发起退款成功!',
                    'data' => '',
                );
            }
        } else {
            return array(
                'status' => 500,
                'msg' => '找不到该订单退款信息!',
                'data' => '');
        }

    }
}
