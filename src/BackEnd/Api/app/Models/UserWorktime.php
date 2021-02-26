<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserWorktime extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'userWorktimes';
    protected $primaryKey = 'id';
    protected $fillable = ['workDay', 'workTime', 'uid', 'uname', 'orderId', 'orderPrice'];
}
