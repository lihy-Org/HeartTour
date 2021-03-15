/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-11 19:54:50
 * @LastEditTime: 2021-03-11 20:04:24
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/Api/oss.ts
 */

import request from './request';

/**
 * 获取OSS配置信息
 * @returns 
 */
export function getConfigs<T>() {
  return request.get<T>('/admin/oss/getKey');
}
