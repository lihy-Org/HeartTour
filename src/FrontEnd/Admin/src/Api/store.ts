/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-23 20:02:10
 * @LastEditTime: 2021-02-24 16:19:22
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/Api/store.ts
 */

import request from './request';

/**
 * 获取门店列表
 * @param data
 */
export function list<T>(data: {
  searchKey?: string;
  pageSize: number;
  page: number;
}) {
  return request.post<T>('/admin/store/list', {
    data,
  });
}

/**
 * 获取门店选择列表
 */
export function getSelectList<T>() {
  return request.get<T>('/admin/store/getSelectList');
}

/**
 * 新增/修改门店
 * @param data
 */
export function addOrUpdate<T>(data: {
  storeId?: string;
  name: string;
  phone: string;
  lng: string;
  lat: string;
  address: string;
  businessHourStart: string;
  businessHourEnd: string;
}) {
  return request.post<T>('/admin/store/addOrUpdate', {
    data,
  });
}

/**
 * 移除门店
 * @param storeId
 */
export function remove<T>(storeId: string) {
  return request.post<T>('/admin/store/remove', {
    data: { storeId },
  });
}
