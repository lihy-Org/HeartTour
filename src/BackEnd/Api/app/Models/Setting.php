<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'settings';
    protected $primaryKey = 'id';
    protected $fillable = ['type','key','value'];

}
