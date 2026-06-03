/**
 * 权限路由守卫
 * 对应后端 @PreAuthorize("hasPermission('xxx')")
 *
 * 职责：
 * - 根据路由 meta.roles 或 meta.permissions 校验用户权限
 * - 无权限时重定向到 403 页面
 */
import type { Router, RouteRecordNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * 安装权限守卫
 */
export function setupPermissionGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    // 路由未配置权限 → 放行
    const requiredRoles = to.meta?.roles as string[] | undefined
    const requiredPermissions = to.meta?.permissions as string[] | undefined

    if (!requiredRoles?.length && !requiredPermissions?.length) {
      next()
      return
    }

    const authStore = useAuthStore()

    // 角色校验（对应后端 hasRole）
    if (requiredRoles?.length) {
      const hasRequiredRole = requiredRoles.some((role) => authStore.roles.includes(role))
      if (!hasRequiredRole) {
        next({ path: '/error/403' })
        return
      }
    }

    // 权限校验（对应后端 hasPermission）
    if (requiredPermissions?.length) {
      const hasRequiredPermission = requiredPermissions.some((perm) =>
        authStore.permissions.includes(perm),
      )
      if (!hasRequiredPermission) {
        next({ path: '/error/403' })
        return
      }
    }

    next()
  })
}
