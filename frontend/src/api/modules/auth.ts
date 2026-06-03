/**
 * 认证 API 模块
 * 对应后端 AuthController
 *
 * 命名规范（对应后端 Service 命名）：
 *   login    → POST   /api/v1/auth/login
 *   register → POST   /api/v1/auth/register
 *   logout   → POST   /api/v1/auth/logout
 *   refresh  → POST   /api/v1/auth/refresh
 *   me       → GET    /api/v1/auth/me
 */
import httpClient from '@/api/http'
import type { ApiResult } from '@/types/api'
import type { LoginDto, RegisterDto, RefreshTokenDto } from '@/types/dto/login.dto'
import type { LoginResponse } from '@/types/models/auth'

/** 基础路径 */
const BASE_PATH = '/auth'

/**
 * 登录
 * POST /api/v1/auth/login
 */
export function login(data: LoginDto): Promise<ApiResult<LoginResponse>> {
  return httpClient.post(`${BASE_PATH}/login`, data)
}

/**
 * 注册
 * POST /api/v1/auth/register
 */
export function register(data: RegisterDto): Promise<ApiResult<void>> {
  return httpClient.post(`${BASE_PATH}/register`, data)
}

/**
 * 登出
 * POST /api/v1/auth/logout
 */
export function logout(): Promise<ApiResult<void>> {
  return httpClient.post(`${BASE_PATH}/logout`)
}

/**
 * 刷新 Token
 * POST /api/v1/auth/refresh
 */
export function refreshToken(data: RefreshTokenDto): Promise<ApiResult<LoginResponse>> {
  return httpClient.post(`${BASE_PATH}/refresh`, data)
}

/**
 * 获取当前用户信息
 * GET /api/v1/auth/me
 */
export function getCurrentUser<T = unknown>(): Promise<ApiResult<T>> {
  return httpClient.get(`${BASE_PATH}/me`)
}
