/** 商品管理 **/

import Layout from '@/layout'

const goodsRouter = {
  path: '/goods',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Goods',
  meta: {
    title: 'goodsManage',
    icon: 'shopping'
  },
  children: [
    {
      path: 'goodsLiving',
      component: () => import('@/views/goods/goodsLiving/index'),
      name: 'GoodsLiving',
      meta: { title: 'goodsLiving' }
    },
    {
      path: 'goodsProduct',
      component: () => import('@/views/goods/goodsProduct/index'),
      name: 'GoodsProduct',
      meta: { title: 'goodsProduct' }
    },
    {
      path: 'goodsDerivatives',
      component: () => import('@/views/goods/goodsDerivatives/index'),
      name: 'GoodsDerivatives',
      meta: { title: 'goodsDerivatives' }
    }
  ]
}

export default goodsRouter
