/** 人员管理 **/

import Layout from '@/layout'

const staffRouter = {
  path: '/staff',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Staff',
  meta: {
    title: 'staffManage',
    icon: 'peoples',
    keepAlive: false,
    keepComponentPages: []
  },
  children: [{
    path: 'rota',
    component: () => import('@/views/staff/rota/index'),
    name: 'Rota',
    meta: {
      title: 'rota',
      keepAlive: false,
      keepComponentPages: []
    }
  },
  {
    path: 'booking',
    component: () => import('@/views/staff/booking/index'),
    name: 'Booking',
    meta: {
      title: 'booking',
      keepAlive: false,
      keepComponentPages: []
    }
  },
  {
    path: 'performance',
    component: () => import('@/views/staff/performance/index'),
    name: 'Performance',
    meta: {
      title: 'performance',
      keepAlive: false,
      keepComponentPages: []
    }
  }]
}

export default staffRouter
