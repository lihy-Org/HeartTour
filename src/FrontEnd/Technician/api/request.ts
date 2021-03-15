/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-08 20:46:29
 * @LastEditTime: 2021-03-08 20:59:35
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: /vue-mp-template/api/request.ts
 */

import axios from "axios";
import Cookie from "lg-cookie";
import Tools from "lg-tools";

const service = axios.create({
  baseURL: process.env.VUE_APP_HOST,
  timeout: 20000,
});

service.interceptors.request.use(
  (config) => {
    // => 显示loading
    // => 如果是GET请求追加时间戳
    if (/get/i.test(config.method)) {
      config.params = {
        ...config.params,
        timeState: Tools.randomCharacters(1) + Date.now(),
      };
    }
    // => 配置请求头
    config.headers = {
      "Content-Type": "application/json",
      Authorization: Cookie.get<string>("token") || "",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    // 清除toast
    const { code, msg } = response.data;
    switch (code) {
      case 0:
        return response.data;
      case 1:
        {
          // 授权登录
          const pathname = window.location.pathname;
          sessionStorage.pathname = pathname;
          // window.$router.replace("/auth/jump");
        }
        break;
      default:
        return response.data;
    }
  },
  (error) => {
    console.log(error);
    /timeout/.test(error.message) && console.log("请求超时，请检查网络");
    return Promise.reject(error);
  }
);

export default service;
