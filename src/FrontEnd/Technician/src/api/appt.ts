/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-19 14:15:07
 * @LastEditTime: 2021-03-19 14:18:19
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Technician\src\api\appt.ts
 */
import request from "./request";

/**
 * 预约列表
 * @param data 
 * @returns 
 */
export function list<T>(data: { page: number; pageSize: number }) {
  return request.post<T>("​/api​/beaut​/appt​/list", data);
}
