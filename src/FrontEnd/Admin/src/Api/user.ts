/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-23 15:13:37
 * @LastEditTime: 2021-02-23 17:09:55
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/Api/user.ts
 */
import request from './request';

/**
 * 用户列表
 * @param data
 */
export function list<T>(data: {
  gender?: number;
  state?: number /** 状态 0正常 1禁用 */;
  consumesSort?: string /** 累计消费 升序-ascend 降序-descend */;
  aptTimesSort?: string /** 预约次数 升序-ascend 降序-descend */;
  searchKey?: string;
  pageSize: number;
  page: number;
}) {
  return request.post<T>('/admin/wechat/list', {
    data,
  });
}

/**
 * 更新用户状态：禁用/解禁
 * @param userId
 */
export function updateState<T>(userId: string) {
  return request.post<T>('/admin/wechat/remove', {
    data: { userId },
  });
}

/**
 * 获取用户宠物列表信息
 * @param wcId 
 */
export function pets<T>(wcId: string) {
  return request.get<T>('/admin/pet/list', {
    params: { wcId }
  })
}
