<?php
namespace App\Repositories;

use App\Models\Config;
use Illuminate\Support\Facades\DB;

class ConfigRepository
{
    public function AddOrUpdate($config)
    {
        $setting = null;
        if (isset($config->configId)) {
            $setting = Config::find($config->configId);
        }
        if (!$setting) {
            if (Config::where('type', $config->type)->where('key', $config->key)->first()) {
                return array(
                    'status' => 500,
                    'msg' => '重复配置!',
                    'data' => '',
                );
            }
            //清除相同type
            if (isset($config->delAll) && $config->delAll == 1) {
                Config::where('type', $config->type)->delete();
            }
            Config::create([
                'type' => $config->type,
                'key' => $config->key,
                'value' => $config->value,
                'sort' => isset($config->sort) ? $config->sort : 1,
                'parentId' => isset($config->parentId) ? $config->parentId : null,
            ]);
            return array(
                'status' => 200,
                'msg' => '添加成功!',
                'data' => '',
            );

        } else {
            $setting->value = $config->value;
            $setting->save();
            return array(
                'status' => 200,
                'msg' => '修改成功!',
                'data' => '');
        }
    }

    public function GetOneById($configId)
    {
        return Config::find($configId);
    }

    public function GetOne($type, $key)
    {
        return Config::where('type', $type)->where('key', $key)->orderBy('sort');
    }
    public function GetByType($type)
    {
        return Config::whereNull('parentId')->with(array('children' => function ($query) {
            $query->select('id', 'type', 'key', 'value', 'sort', 'parentId');
        }))->where('type', $type)->orderBy('sort');
    }

    public function GetTopConfig($configId)
    {
        $config = $this->GetOne($type, $key);
        if ($config->parentId == '' || $config->parentId == null) {
            return $config;
        } else {
            return $this->GetTopConfig($config->parentId);
        }
    }

    public function Remove($configId)
    {
        try {
            DB::beginTransaction(); // 开启事务
            $this->RemoveChild($configId);
            Db::commit(); // 提交事务
            return array(
                'status' => 200,
                'msg' => '操作成功!',
                'data' => '');

        } catch (\Exception $exception) {
            dd($exception);
            Db::rollback(); // 回滚事务
            return array(
                'status' => 500,
                'msg' => '操作失败!',
                'data' => '');
        }
    }

    public function RemoveChild($configId)
    {
        $config = Config::find($configId);
        if ($config) {
            $children = Config::where('parentId', $config->id)->get();
            foreach ($children as $child) {
                $this->RemoveChild($child->id);
            }
            $config->forceDelete();
        }
    }
}
