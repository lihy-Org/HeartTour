/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 22:58:33
 * @LastEditTime: 2021-03-25 14:18:41
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Technician\src\router\index.ts
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login/Login.vue'),
    meta: {
      title: '心之旅美容师管理平台'
    }
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import(/* webpackChunkName: "index" */ '../views/Index/Index.vue'),
    meta: {
      title: '心之旅美容师管理平台'
    }
  },
  {
    path: '/performance',
    name: 'Performance',
    component: () => import(/* webpackChunkName: "performance" */ '../views/Performance/Performance.vue'),
    meta: {
      title: '我的业绩'
    }
  },
  {
    path: '/apt-details',
    name: 'AptDetails',
    component: () => import(/* webpackChunkName: "aptDetails" */ '../views/AptDetails/AptDetails.vue'),
    meta: {
      title: '预约详情'
    }
  },
  {
    path: '/apt-list',
    name: 'AptList',
    component: () => import(/* webpackChunkName: "aptList" */ '../views/AptList/AptList.vue'),
    meta: {
      title: '预约信息'
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


// 导航守卫
router.beforeEach((to, from, next) => {
  if(to.path !== '/favicon.icon') {
    document.title = to.meta.title ? to.meta.title as string : '';
    next();
  }
});

export default router
