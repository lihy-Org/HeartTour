/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-08 20:50:36
 * @LastEditTime: 2021-03-08 20:53:20
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /vue-mp-template/api/test.ts
 */

import request from './request';

export function GET(params: { id: string}) {
  return request({
    url: '',
    params
  })
}

export function POST(data: { tel: string, code: string}) {
  return request({
    url: '',
    method: 'POST',
    data
  })
}

