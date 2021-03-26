/*
 * @Author: Li-HONGYAO
 * @Date: 2020-11-19 17:24:26
 * @LastEditTime: 2021-03-26 11:14:50
 * @LastEditors: Li-HONGYAO
 * @Description: 路由
 * @FilePath: \Admin\.umirc.ts
 */

// ref: https://umijs.org/zh-CN/config

import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dva: {},
  ignoreMomentLocale: true,
  dynamicImport: {
    loading: '@/Loading',
  },
  hash: true,
  history: { type: 'browser' },
  routes: [
    { path: '/login', component: '@/pages/Login' }, // 登录
    {
      path: '/',
      component: '@/layouts',
      routes: [
        { path: '/', redirect: '/index' },
        { path: '/index', component: '@/pages/Dashboard' }, // 仪表盘
        {
          path: '/orders/appointment',
          component: '@/pages/Orders/Appointment',
        }, // 订单管理 - 预约订单管理
        { path: '/orders/living', component: '@/pages/Orders/Living' }, // 订单管理 - 活体订单管理
        { path: '/orders/product', component: '@/pages/Orders/Product' }, // 订单管理 - 产品订单管理
        { path: '/orders/ambitus', component: '@/pages/Orders/Ambitus' }, // 订单管理 - 周边订单管理
        { path: '/combo', component: '@/pages/Combo' }, // 套餐管理
        { path: '/shop/living', component: '@/pages/Shop/Living' }, // 商城管理 - 活体
        { path: '/shop/product', component: '@/pages/Shop/Product' }, // 商城管理 - 产品
        { path: '/shop/ambitus', component: '@/pages/Shop/Ambitus' }, // 商城管理 - 周边
        { path: '/store', component: '@/pages/Store' }, // 门店管理
        { path: '/personnel', component: '@/pages/Personnel' }, // 人员管理
        { path: '/user', component: '@/pages/User' }, // 用户管理
        { path: '/accounts/shop', component: '@/pages/Accounts/Shop' }, // 账目管理 - 商城
        { path: '/accounts/store', component: '@/pages/Accounts/Store' }, // 账目管理 - 门店
        { path: '/configs', component: '@/pages/Configs' }, // 配置相关 - 杂项配置
        { path: '/roles', component: '@/pages/Roles' }, // 角色管理
        { path: '*', component: '@/pages/404' }, // 404
      ],
    },
  ],
});
