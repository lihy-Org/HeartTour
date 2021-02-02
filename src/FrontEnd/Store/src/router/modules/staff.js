/** 人员管理 **/

import Layout from '@/layout'

const staffRouter = {
  path: '/staff',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Staff',
  meta: {
    title: 'staffManage',
    icon: 'peoples'
  },
  children: [
    {
      path: 'rota',
      component: () => import('@/views/staff/rota/index'),
      name: 'Rota',
      meta: { title: 'rota' }
    },
    {
      path: 'booking',
      component: () => import('@/views/staff/booking/index'),
      name: 'Booking',
      meta: { title: 'booking' }
    },
    {
      path: 'performance',
      component: () => import('@/views/staff/performance/index'),
      name: 'Performance',
      meta: { title: 'performance' }
    }
  ]
}

export default staffRouter
