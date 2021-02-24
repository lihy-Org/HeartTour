/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-23 18:04:53
 * @LastEditTime: 2021-02-23 21:30:28
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/Api/config.ts
 */
import request from './request';

/**
 * 获取配置
 * @param type
 * @param key
 */
export function get<T>(type: string, key?: string) {
  return request.get<T>(`/admin/config/${type}${key ? `/${key}` : ''}`);
}

/**
 * 添加或修改配置
 * @param data 
 */
export function addOrUpdate<T>(data:{
  type: string;
  key: string;
  value: string;
  configId?: string;
  parentId?: string;
  delAll?: number; /** 是否清空,1则清空所有type下配置 */
}) {
  return request.post<T>('/admin/config/addOrUpdate', {
    data
  })
}

/**
 * 移除配置
 * @param configId 
 */
export function remove<T>(configId: string) {
  return request.post<T>('/admin/config/remove', {
    params: { configId }
  })
}
