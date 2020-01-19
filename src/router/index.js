import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入登录组件
import login from '@/views/login'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: () => import('@/views/home'),
    children: [
      { path: 'page', component: () => import('@/views/home/first-page') },
      { path: 'quess', component: () => import('@/views/home/quesstions') },
      { path: 'video', component: () => import('@/views/home/video') },
      {
        path: 'me',
        component: () => import('@/views/home/me')
      }
    ]
  },
  { path: '/search', component: () => import('@/views/search') },
  { path: '/articles/:articleId',
    component: () => import('@/views/article-details'),
    props: true
  },
  {
    path: '/edit', component: () => import('@/views/edit-user')
  }
]

const router = new VueRouter({
  routes
})

export default router
