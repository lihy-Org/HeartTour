/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-26 14:19:45
 * @LastEditTime: 2021-02-26 17:41:54
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/Api/combo.ts
 */
import request from './request';

/** 套餐列表 */
export function list<T>(data: {
  comboType?: number /** 套餐类型：0-主套餐 1-增项套餐 */;
  state?: number /** 上架状态 0-待上架 1-已上架 2-已下架 */;
  page: number;
  pageSize: number;
}) {
  return request.post<T>('/admin/combo/list', {
    data,
  });
}

/**
 * 新增或修改套餐管理
 * @param data
 */
export function addOrUpdate<T>(data: {
  comboId?: string;
  comboType: number /** 套餐类型：0-主套餐 1-增项套餐 */;
  varietyIds: string[] /** 适用品种 */;
  name: string /** 名称 */;
  originPrice: string /** 原价 */;
  salePrice: string /** 售价 */;
  nursingTime: string /** 护理时长 */;
  bgImg: string /** 背景图 */;
  bannerImgs: string[] /** 轮播图 */;
  detailImgs: string[] /** 详情图 */;
}) {
  return request.post<T>('/admin/combo/addOrUpdate', {
    data,
  });
}

/**
 * 上下架
 * @param data
 */
export function shelvesToggle<T>(comboId: string) {
  return request.post<T>('/admin/combo/remove', {
    data: { comboId },
  });
}

/**
 * 分配技师
 * @param data
 */
export function setBeautician<T>(data: { comboId: string; userIds: string[] }) {
  return request.post<T>('/admin/combo/setBeautician', {
    data,
  });
}
