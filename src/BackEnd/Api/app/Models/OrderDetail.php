<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderDetail extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'orderDetails';
    protected $primaryKey = 'id';
    protected $fillable = ['orderId','orderNo','goodsId','num','unitPrice','totalMoney'];
}
