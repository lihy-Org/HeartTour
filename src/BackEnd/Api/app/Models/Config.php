<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Config extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'configs';
    protected $primaryKey = 'id';
    protected $fillable = ['type', 'key', 'value', 'parentId'];

    public function children()
    {
        return $this->hasMany(Config::class, 'parentId', 'id')->with(array('children' => function ($query) {
            $query->select('id', 'type', 'key', 'value', 'sort', 'parentId');
        }));
    }
}
