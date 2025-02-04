/*
 * @Author: Li-HONGYAO
 * @Date: 2020-11-19 20:00:28
 * @LastEditTime: 2021-03-26 11:02:12
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Admin\.umirc.dev.ts
 */
import { defineConfig } from 'umi';

// 开发中，可能配置了多个后端人员，为了方便操作
// 我们可以将起服务器地址存储起来，以便使用
let HOST = {
  '后台A': 'http://api.xinzhilv.vip/api',
}

export default defineConfig({
  define: {
    "process.env.BASE": '',
    "process.env.NAME": 'development',
    "process.env.HOST": HOST.后台A
  },
});
