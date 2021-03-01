/*
 * @Author: Li-HONGYAO
 * @Date: 2021-02-24 20:43:13
 * @LastEditTime: 2021-02-26 12:32:08
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/Api/appt.ts
 */
import request from './request';

/**
 * 预约列表
 * @param data
 */
export function list<T>(data: {
  storeId?: string;
  state?: number /** 0-已预约 1-进行中 2-待接取 3-已完成 */;
  startDate?: string /** 预约开始时间 */;
  endDate?: string /** 预约结束时间 */;
  searchKey?: string;
  page: number;
  pageSize: number;
}) {
  return request.post<T>('/admin/appt/list', {
    data,
  });
}

/**
 * 人员排班表
 * @param storeId
 */
export function getWorkTime<T>(data: {
  storeId: string;
  workDay?: string;
  workTime?: string;
  userId?: string;
}) {
  return request.post<T>('/admin/appt/getWorkTime', {
    data,
  });
}

/**
 * 修改预约信息
 * @param data
 */
export function trans<T>(data: {
  orderId: string;
  workDay: string;
  workTime: string;
  userId: string /** 技师id */;
}) {
  return request.post<T>('/admin/appt/trans', {
    data,
  });
}
