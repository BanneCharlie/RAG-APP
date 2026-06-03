/**
 * 认证路由守卫
 * 对应后端 Security 拦截器 + @PreAuthorize
 *
 * 职责：
 * - 检查用户是否已登录，未登录则重定向到登录页
 * - Token 过期检测
 * - 白名单放行（公开页面）
 */
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { appConfig } from '@/config/app'
import { localStorageUtil } from '@/utils/storage'
import { useAppStore } from '@/stores/app'

/** 白名单路由（无需认证即可访问，对应后端 @PermitAll） */
const WHITE_LIST = ['/auth/login', '/auth/register', '/error/404', '/error/403']

/**
 * 安装认证守卫
 */
export function setupAuthGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    // 设置页面标题（对应后端 Swagger 文档标题）
    const appStore = useAppStore()
    if (to.meta?.title) {
      appStore.setPageTitle(to.meta.title as string)
    }

    // 白名单放行
    if (WHITE_LIST.includes(to.path)) {
      next()
      return
    }

    // 检查认证状态
    const authStore = useAuthStore()
    const token = localStorageUtil.get<string>(appConfig.tokenKey, '')

    if (!token) {
      // 未登录，重定向到登录页并带上回跳地址
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // 已登录但 store 未初始化 → 同步 Token
    if (!authStore.token) {
      const refreshToken = localStorageUtil.get<string>(appConfig.refreshTokenKey, '')
      authStore.setToken(token, refreshToken)
    }

    next()
  })
}
