/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-08 20:46:29
 * @LastEditTime: 2021-03-25 15:29:35
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Technician\src\api\request.ts
 */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookie from "lg-cookie";
import Tools from "lg-tools";
import { Toast } from "vant";

const service = axios.create({
  baseURL: process.env.VUE_APP_HOST,
  timeout: 20000,
});

// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // => 如果是GET请求追加时间戳
    if (config.method && /get/i.test(config.method)) {
      config.params = {
        ...config.params,
        timeState: Tools.randomCharacters(1) + Date.now(),
      };
    }
    // => 配置请求头
    const token = Cookie.get<string>("LOVEPETS_TOKEN");
    config.headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
    console.log(config)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 清除toast
    const { status, msg } = response.data;
    switch (status) {
      case 200:
        return response.data;
      default:
        Toast.fail(msg);
        return response.data;
    }
  },
  (error: any) => {
    console.log(error);
    /timeout/.test(error.message) && Toast("请求超时，请检查网络");
    return Promise.reject(error);
  }
);

export default service;
