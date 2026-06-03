/**
 * 认证状态管理（对应后端 AuthService）
 *
 * 职责：
 * - 管理登录/登出状态
 * - Token 的存储与刷新
 * - 当前用户信息缓存
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginResponse } from '@/types/models/auth'
import type { LoginDto, RegisterDto } from '@/types/dto/login.dto'
import { localStorageUtil } from '@/utils/storage'
import { appConfig } from '@/config/app'
import { STORAGE_KEYS } from '@/config/constant'
import * as authApi from '@/api/modules/auth'
import type { ApiResult } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  // ===== State（对应后端 Entity 的持久化字段） =====
  const token = ref<string>(localStorageUtil.get<string>(appConfig.tokenKey, ''))
  const refreshToken = ref<string>(localStorageUtil.get<string>(appConfig.refreshTokenKey, ''))
  const currentUser = ref<Record<string, unknown> | null>(
    localStorageUtil.get<Record<string, unknown> | null>(STORAGE_KEYS.USER_INFO, null),
  )
  const permissions = ref<string[]>(
    localStorageUtil.get<string[]>(STORAGE_KEYS.PERMISSIONS, []),
  )
  const roles = ref<string[]>(
    localStorageUtil.get<string[]>(STORAGE_KEYS.ROLES, []),
  )

  // ===== Getters（对应后端的查询方法） =====
  const isAuthenticated = computed(() => !!token.value)
  const hasPermission = computed(() => (code: string) => permissions.value.includes(code))
  const hasRole = computed(() => (role: string) => roles.value.includes(role))

  // ===== Actions（对应后端的 Service 方法） =====

  /**
   * 登录（对应后端 AuthService.login）
   * POST /api/v1/auth/login
   */
  async function login(loginDto: LoginDto): Promise<ApiResult<LoginResponse>> {
    const res = await authApi.login(loginDto)
    const { accessToken, refreshToken: rToken } = res.data
    setToken(accessToken, rToken)
    return res
  }

  /**
   * 注册（对应后端 AuthService.register）
   * POST /api/v1/auth/register
   */
  async function register(registerDto: RegisterDto): Promise<void> {
    await authApi.register(registerDto)
  }

  /**
   * 登出（对应后端 AuthService.logout）
   * 清除本地状态 + 调用后端
   */
  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch {
      // 即使后端登出失败，也清除本地状态
    } finally {
      clearAuth()
    }
  }

  /**
   * 获取当前用户信息（对应后端 AuthService.getCurrentUser）
   * GET /api/v1/auth/me
   */
  async function fetchCurrentUser<T = Record<string, unknown>>(): Promise<T> {
    const res = await authApi.getCurrentUser<T>()
    const userData = res.data as Record<string, unknown>
    currentUser.value = userData
    localStorageUtil.set(STORAGE_KEYS.USER_INFO, userData)
    return res.data as T
  }

  /**
   * 设置 Token（对应后端登录成功后的 token 写入）
   */
  function setToken(accessToken: string, newRefreshToken: string): void {
    token.value = accessToken
    refreshToken.value = newRefreshToken
    localStorageUtil.set(appConfig.tokenKey, accessToken)
    localStorageUtil.set(appConfig.refreshTokenKey, newRefreshToken)
  }

  /**
   * 清除认证信息（对应后端注销/Token 过期后的清理）
   */
  function clearAuth(): void {
    token.value = ''
    refreshToken.value = ''
    currentUser.value = null
    permissions.value = []
    roles.value = []
    localStorageUtil.remove(appConfig.tokenKey)
    localStorageUtil.remove(appConfig.refreshTokenKey)
    localStorageUtil.remove(STORAGE_KEYS.USER_INFO)
    localStorageUtil.remove(STORAGE_KEYS.PERMISSIONS)
    localStorageUtil.remove(STORAGE_KEYS.ROLES)
  }

  return {
    // State
    token,
    refreshToken,
    currentUser,
    permissions,
    roles,
    // Getters
    isAuthenticated,
    hasPermission,
    hasRole,
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    setToken,
    clearAuth,
  }
})
