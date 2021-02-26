<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pet extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'pets';
    protected $primaryKey = 'id';
    protected $fillable = ['wcid','avatar','nickname','gender','varietyId','variety','birthday','color','shoulderHeight','is_sterilization','remark'];
}
