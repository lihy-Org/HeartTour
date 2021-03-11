<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Combo extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'combos';
    protected $primaryKey = 'id';
    protected $fillable = ['comboType', 'name', 'desc', 'originPrice', 'salePrice', 'nursingTime', 'bgImg', 'sales', 'state'];

    public function Varietys()
    {
        return $this->hasMany(ComboVariety::class, 'cid', 'id');
    }

    public function Users()
    {
        return $this->hasMany(ComboBeautician::class, 'cid', 'id');
    }
}
