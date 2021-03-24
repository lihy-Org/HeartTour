/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-24 09:32:27
 * @LastEditTime: 2021-03-24 11:07:59
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Admin\src\Api\rfrule.ts
 */

import request from './request';

/**
 * 新增或修改费率挡位
 * @param data
 */
export function addOrUpdate<T>(data: {
  rid?: string /** 费率id */;
  minMin: number /** 最小分钟数 */;
  maxMin: number /** 最大分钟数 */;
  rate: number /** 费率 */;
}) {
  return request.post<T>('/admin/rfrule/addOrUpdate', {
    data,
  });
}
/**
 * 不可退款时间
 * @param min
 * @returns
 */
export function setLimit<T>(maxMin: number) {
  return request.post<T>('/admin/rfrule/setLimit', {
    data: { maxMin },
  });
}
/**
 * 获取不可退时间
 * @returns
 */
export function getLimit<T>() {
  return request.post<T>('/admin/rfrule/getLimit');
}

/**
 * 获取费率档次列表
 * @returns
 */
export function list<T>() {
  return request.post<T>('/admin/rfrule/list');
}
/**
 * 删除
 * @returns
 */
export function remove<T>(rId: string) {
  return request.post<T>('/admin/rfrule/remove', {
    data: { rId },
  });
}
