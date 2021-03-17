/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-17 13:37:50
 * @LastEditTime: 2021-03-17 17:14:00
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Technician\src\api\auth.ts
 */

import request from "./request";

/**
 * 登录
 * @param data
 * @returns
 */
export function login<T>(data: { phone: string; code: string }) {
  return request.post<T>("/api/beaut/login", data);
}
