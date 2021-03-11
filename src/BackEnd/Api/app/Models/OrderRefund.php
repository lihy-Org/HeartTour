<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderRefund extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'orderRefunds';
    protected $primaryKey = 'id';
    protected $fillable = ['orderId','refundNo','wcId','wcName','type','money','reason','images','refuseReason','merchantName','merchantPhone'
    ,'merchantAddress','merchantDoorplate','expName','expNumber','cargoStatus','state','userId','userName','examineDate'];
}
