import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my')
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('@/views/search')
      },
      {
        // 动态路由, 根据不同的文章 id 来展示不同的页面内容
        path: '/article/:articleId',
        name: 'article',
        component: () => import('@/views/article'),
        // 将路由动态参数映射到组件的 props 中，更推荐这种做法
        props: true
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    // 路由懒加载: 当访问到这个页面组件的时候才去动态加载里面的内容
    component: () => import('@/views/login')
  }
]

// 路由实例对象
const router = new VueRouter({
  routes
})

export default router
