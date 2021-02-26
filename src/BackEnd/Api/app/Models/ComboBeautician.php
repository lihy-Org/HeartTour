<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComboBeautician extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'comboBeauticians';
    protected $primaryKey = 'id';
    protected $fillable = ['cid','cname','storeId','storeName','userId','userName'];
}
