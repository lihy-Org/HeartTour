/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-23 16:44:42
 * @LastEditTime: 2021-02-26 15:44:29
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

/**
 * 分配门店
 * @param data
 */
export function setStore<T>(data: { userId: string; storeId: string }) {
  return request.post<T>('/admin/user/setStore', {
    data,
  });
}

/**
 * 删除人员
 * @param userId
 */
export function remove<T>(userId: string) {
  return request.post<T>('/admin/user/remove', {
    data: { userId },
  });
}
/**
 * 添加人员
 * @param data
 */
export function addOrUpdate<T>(data: {
  userId?: string;
  name: string;
  phone: string;
  avatar: string;
  gender: number;
  age: number;
  postId: string;
  titleIds?: string[];
  isBeautician: number /** 是否技师 */;
}) {
  return request.post<T>('/admin/user/addOrUpdate', {
    data,
  });
}

/**
 * 设置店长
 * @param userId
 */
export function setManage<T>(userId: string) {
  return request.post<T>('/admin/user/setManage', {
    data: { userId },
  });
}

/**
 * 技师选择列表
 */
export function getSelectList<T>() {
  return request.get<T>('/admin/user/getSelectList');
}
