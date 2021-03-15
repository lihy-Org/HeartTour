/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-15 13:25:34
 * @LastEditTime: 2021-03-15 14:16:54
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Admin\.umirc.prod.ts
 */
import { defineConfig } from 'umi';
export default defineConfig({
  // 1. 部署至二级目录，比如部署到“umi-ddou-h5”目录下，则配置如下：
  // base: '/umi-ddou-h5/',
  // publicPath: '/umi-ddou-h5/',
  // 2. 定义环境变量
  define: {
    "process.env.BASE": '',
    "process.env.NAME": 'production',
    "process.env.HOST": 'http://api.xinzhilv.vip:32001/api'
  },
});