import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'

Vue.use(VueRouter)

// 关于VUE项目中报Error: Avoided redundant navigation to current location: 的错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
        meta: { title: '欢迎' }
      },
      {
        path: '/users',
        component: Users,
        meta: { title: '用户列表' }
      },
      {
        path: '/rights',
        component: Rights,
        meta: { title: '权限列表' }
      },
      {
        path: '/roles',
        component: Roles,
        meta: { title: '角色列表' }
      },
      {
        path: '/categories',
        component: Cate,
        meta: { title: '商品分类' }
      },
      {
        path: '/params',
        component: Params,
        meta: { title: '分类参数' }
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
