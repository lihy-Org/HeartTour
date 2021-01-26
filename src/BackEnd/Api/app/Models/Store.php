<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'stores';
    protected $primaryKey = 'id';
    protected $fillable = ['name','lng','lat','phone','address','businessHourStart','businessHourEnd','type'];
}
