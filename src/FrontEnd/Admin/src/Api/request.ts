/*
 * @Author: Li-HONGYAO
 * @Date: 2021-01-17 23:30:37
 * @LastEditTime: 2021-02-24 09:36:42
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /Admin/src/Api/request.ts
 */
import Utils from '@/utils/utils';
import { extend, RequestOptionsInit } from 'umi-request';
import { message } from 'antd';
import Cookie from 'lg-cookie';
import Tools from 'lg-tools';

const service = extend({
  prefix: process.env.HOST,
  timeout: 20000,
  errorHandler: (error) => {
    console.log('____error', JSON.stringify(error));
    if (/timeout/.test(error.message)) {
      message.error('请求超时');
    } else {
      message.error('系统升级，请稍后再试');
    }
    return null;
  },
});

service.interceptors.request.use((url: string, options: RequestOptionsInit) => {
  // GET请求添加时间戳
  if (options.method && /get/i.test(options.method)) {
    options.params = {
      ...options.params,
      timeState: Tools.randomCharacters(1, 'uppercase') + Date.now(),
    };
  }
  return {
    url,
    options: {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookie.get('HT_TOKEN') || ''}`,
      },
    },
  };
});

// 响应拦截
service.interceptors.response.use(async (response, options) => {
  const res = await response.clone().json();
  message.destroy();
  switch (res.status) {
    case 200:
      return res;
    case -10:
      Utils.push('/login');
      return res;
    default:
      message.error(res.msg);
      return res;
  }
});
export default service;
