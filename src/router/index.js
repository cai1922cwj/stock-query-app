import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import StockDetail from '../views/StockDetail.vue'
import Market from '../views/Market.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { title: '搜索' }
  },
  {
    path: '/stock/:code',
    name: 'StockDetail',
    component: StockDetail,
    meta: { title: '股票详情' }
  },
  {
    path: '/market',
    name: 'Market',
    component: Market,
    meta: { title: '市场' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 股票查询APP` : '股票查询APP'
  next()
})

export default router
