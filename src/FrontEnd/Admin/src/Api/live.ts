/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-02 11:15:55
 * @LastEditTime: 2021-03-03 11:11:07
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/Api/livePet.ts
 */

import request from './request';

/**
 * 新增或修改活体
 * @param data
 */
export function addOrUpdate<T>(data: {
  liveId?: string /** 活体id */;
  typeId: string /** 活体类型id */;
  gender: number /** 性别 0未知，1男，2女 */;
  vaccine: number /** 是否疫苗 1-已打疫苗 0-未打疫苗 */;
  number: string /** 活体编号 */;
  color: string /** 毛色 */;
  varietyId: string /** 品种id */;
  originPrice: string /** 原价 */;
  salePrice: string /** 售价 */;
  age: number /** 年龄 */;
  shoulderHeight: number /** 肩高 */;
  note: string /** 备注 */;
  avatar: string /** 头像 */;
  certificates: string[] /** 证书 */;
  detailImgs: string[] /** 详情图 */;
}) {
  return request.post<T>('/admin/live/addOrUpdate', {
    data,
  });
}

/**
 * 活体列表
 * @param data
 */
export function list<T>(data: {
  typeId?: string /** 活体类型编号 */;
  varietyId?: string /** 品种id */;
  searchKey?: string;
  state?: number;
  pageSize: number;
  page: number;
}) {
  return request.post<T>('/admin/live/list', {
    data,
  });
}
