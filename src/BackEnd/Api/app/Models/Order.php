<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'orders';
    protected $primaryKey = 'id';
    protected $fillable = ['orderNo','wcId','wcName','remark','petId','petName','petType','userId','userName','storeId','storeName','mainComboName','phone','apptTime','addId','address','expId','expName'
    ,'expNumber','totalMoney','freight','payMoney','payType','type','payTime','shippingTime','isOffline','serviceTime','finishTime','cancelTime','state','remark','userRemark','storeRemark'];

    public function Details()
    {
        return $this->hasMany(OrderDetail::class, 'orderId', 'id');
    }
}
