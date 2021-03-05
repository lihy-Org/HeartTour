<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LivePet extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'livePets';
    protected $primaryKey = 'id';
    protected $fillable = ['typeId', 'typeName', 'gender', 'vaccine', 'number', 'color', 
    'varietyId', 'variety', 'originPrice', 'salePrice','age', 'shoulderHeight', 'note', 'avatar', 'sales', 'state'];

   
}
