/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-02-23 13:36:56
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Admin/src/Api/user.ts
 */
import request from './request';

/**
 * 登录
 * @param data 
 */
export function login<T>(data: {
  phone: string;
  code: string;
}) {
  return request.post<T>('/admin/login', {
    data
  })
}

/**
 * 获取验证码
 * @param phone 
 */
export function verifCode<T>(phone: string) {
  return request.post<T>('/admin/verifCode', {
   data: { phone }
  })
}