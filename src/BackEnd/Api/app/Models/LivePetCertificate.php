<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LivePetCertificate extends Model
{
    use HasFactory;
    use SoftDeletes;
    use \App\Http\Traits\UseUuid;
    protected $table = 'livePetCertificates';
    protected $primaryKey = 'id';
    protected $fillable = ['gid', 'url'];

}
