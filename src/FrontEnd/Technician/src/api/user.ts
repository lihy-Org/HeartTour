/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-25 15:08:05
 * @LastEditTime: 2021-03-25 15:27:36
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Technician\src\api\user.ts
 */
import request from "./request";

/**
 * 获取用户信息
 * @returns
 */
export function info<T>() {
  return request.get<T>("/​api​/beaut​/user​/info");
}
/**
 * 个人某天预约信息
 * @returns
 */
export function appt<T>(month: string) {
  return request.get<T>("/​api​/beaut​/user​/appt", {
    params: { month },
  });
}
