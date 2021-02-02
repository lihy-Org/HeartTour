<?php
namespace App\Repositories;

use App\Models\User;
use App\Models\UserTitle;
use App\Repositories\ConfigRepository;
use Illuminate\Support\Facades\DB;

class UserRepository
{

    public function AddOrUpdate($data)
    {
        $ConfigRepository = new ConfigRepository();
        $user = null;
        if (isset($data->userId)) {
            $user = user::find($data->userId);
        }
        if (!$user) {
            try {
                DB::beginTransaction(); // 开启事务
                $post = $ConfigRepository->GetOneById($data->postId);
                if (!$post) {
                    return array(
                        'status' => 500,
                        'msg' => '无该职位信息!',
                        'data' => '');
                }
                $user = User::create([
                    'name' => $data->name,
                    'phone' => $data->phone,
                    'avatar' => $data->avatar,
                    'gender' => $data->gender,
                    'age' => $data->age,
                    'postId' => $data->postId,
                    'post' => $post->value,
                    'isWorker' => isset($data->isWorker) ? $data->isWorker : 0,
                    'type' => 3,
                    'state' => 0,
                ]);
                if (isset($data->titleIds)) {
                    foreach ($data->titleIds as $v) {
                        $title = $ConfigRepository->GetOneById($v);
                        if (!$title) {
                            Db::rollback(); // 回滚事务
                            return array(
                                'status' => 500,
                                'msg' => '无该头衔信息!',
                                'data' => '');
                        }
                        UserTitle::create(['uid' => $user->id, 'titleId' => $title->id, 'title' => $title->value]);
                    }
                }
                Db::commit(); // 提交事务
                return array(
                    'status' => 200,
                    'msg' => '添加信息成功!',
                    'data' => '');

            } catch (\Exception $exception) {
                dd($exception);
                Db::rollback(); // 回滚事务
                return array(
                    'status' => 500,
                    'msg' => '保存失败!',
                    'data' => '');
            }
        } else {
            try {
                DB::beginTransaction(); // 开启事务
                $post = $ConfigRepository->GetOneById($data->postId);
                if (!$post) {
                    return array(
                        'status' => 500,
                        'msg' => '无该职位信息!',
                        'data' => '');
                }
                $user->name = $data->name;
                $user->phone = $data->phone;
                $user->avatar = $data->avatar;
                $user->gender = $data->gender;
                $user->age = $data->age;
                $user->postId = $data->postId;
                $user->post = $post->value;
                $user->isWorker = isset($data->isWorker) ? $data->isWorker : 0;
                $user->save();
                UserTitle::where('uid', $user->id)->delete();
                if (isset($data->titleIds)) {
                    foreach ($data->titleIds as $k => $v) {
                        $title = $ConfigRepository->GetOneById($v);
                        if (!$title) {
                            Db::rollback(); // 回滚事务
                            return array(
                                'status' => 500,
                                'msg' => '无该头衔信息!',
                                'data' => '');
                        }
                        UserTitle::create(['uid' => $user->id, 'titleId' => $title->id, 'title' => $title->value]);
                    }
                }
                Db::commit(); // 提交事务
                return array(
                    'status' => 200,
                    'msg' => '添加信息成功!',
                    'data' => '');
            } catch (\Throwable $th) {
                Db::rollback(); // 回滚事务
                return array(
                    'status' => 500,
                    'msg' => '保存失败!',
                    'data' => '');
            }
        }
    }

    public function GetList($data)
    {
        $users = User::where('state', 0)->whereNotIn('type', [0, 1])->orderBy('created_at');
        if (isset($data->searchKey)) {
            $users = $users->where(function ($query) use ($data) {
                $query->where('name', 'like', '%' . $data->searchKey . '%')
                    ->orWhere('phone', 'like', '%' . $data->searchKey . '%');
            });
        }
        if (isset($data->storeId)) {
            $users = $users->where('storeId', $data->storeId);
        }
        if (isset($data->postId)) {
            $users = $users->where('postId', $data->postId);
        }
        if (isset($data->gender)) {
            $users = $users->where('gender', $data->gender);
        }
        return $users;
    }

    public function Remove($userId)
    {
        $user = User::find($userId);
        if ($user) {
            $user->state = 1;
            $user->save();
            UserTitle::where('uid', $userId)->delete();
            return array(
                    'status' => 200,
                    'msg' => '删除成功!',
                    'data' => '');
        }
        return array(
                'status' => 500,
                'msg' => '删除失败,找不到该人员!',
                'data' => '');
        
    }
}
