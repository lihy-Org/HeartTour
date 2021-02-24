/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-23 16:44:42
 * @LastEditTime: 2021-02-23 17:43:22
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/Api/personnel.ts
 */
import request from './request';

/**
 * 人员列表
 * @param data
 */
export function list<T>(data: {
  storeId?: string;
  post?: string /** 职位 */;
  gender?: number /** 1-男  2-女 */;
  searchKey?: string;
  pageSize: number;
  page: number;
}) {
  return request.post<T>('/admin/user/list', {
    data,
  });
}
