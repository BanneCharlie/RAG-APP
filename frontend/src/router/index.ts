/**
 * 路由配置
 * 对应后端 Controller 的 @RequestMapping，映射 URL → 页面组件
 *
 * 路由设计原则（对应后端 RESTful 风格）：
 * - /auth/*        → 认证模块（登录、注册）
 * - /dashboard     → 仪表盘
 * - /user/*        → 用户管理
 * - /error/*       → 错误页面
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupAuthGuard } from './guards/authGuard'
import { setupPermissionGuard } from './guards/permissionGuard'

/** 路由表（对应后端 Controller 的接口映射） */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { title: '登录' },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: { title: '注册' },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '仪表盘', icon: 'dashboard' },
      },
      {
        path: 'user',
        name: 'User',
        meta: { title: '用户管理', icon: 'user' },
        children: [
          {
            path: '',
            name: 'UserList',
            component: () => import('@/views/user/UserListView.vue'),
            meta: { title: '用户列表', roles: ['ADMIN', 'USER_MANAGER'] },
          },
          {
            path: ':id',
            name: 'UserDetail',
            component: () => import('@/views/user/UserDetailView.vue'),
            meta: { title: '用户详情' },
          },
        ],
      },
    ],
  },
  {
    path: '/error',
    children: [
      {
        path: '403',
        name: 'Forbidden',
        component: () => import('@/views/error/ForbiddenView.vue'),
        meta: { title: '403 无权限' },
      },
      {
        path: '404',
        name: 'NotFound',
        component: () => import('@/views/error/NotFoundView.vue'),
        meta: { title: '404 页面不存在' },
      },
    ],
  },
  {
    // 未匹配路由 → 404
    path: '/:pathMatch(.*)*',
    redirect: '/error/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 安装路由守卫（对应后端 Security 拦截链）
setupAuthGuard(router)
setupPermissionGuard(router)

export default router
