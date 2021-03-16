<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserKpi extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'userkpis';
    protected $primaryKey = 'id';
    protected $fillable = ['storeId', 'userId', 'userName', 'month', 'kpi', 'setId', 'setName'];
}
