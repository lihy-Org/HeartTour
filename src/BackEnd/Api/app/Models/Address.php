<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'addresses';
    protected $primaryKey = 'id';
    protected $fillable = ['wcId', 'name', 'phone', 'address', 'doorplate', 'default'];
}
