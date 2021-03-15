/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 22:58:33
 * @LastEditTime: 2021-03-14 22:22:29
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Technician/src/router/index.ts
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
    component: () => import(/* webpackChunkName: "index" */ '../views/Login/Login.vue'),
    meta: {
      title: '心之旅宠物'
    }
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import(/* webpackChunkName: "index" */ '../views/Index/Index.vue'),
    meta: {
      title: '首页'
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
