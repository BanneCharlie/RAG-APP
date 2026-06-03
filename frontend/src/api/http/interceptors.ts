/**
 * Axios 拦截器
 * 对应后端 aspect 层（切面：日志、权限、监控）
 */
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import type { ApiResult } from '@/types/api'
import { BusinessCode } from '@/types/api'
import { appConfig } from '@/config/app'
import { localStorageUtil } from '@/utils/storage'
import { parseAxiosError } from '@/utils/error-handler'

/**
 * 请求拦截器 - 自动携带 Token
 * 对应后端 Security 拦截器
 */
export function setupRequestInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 记录请求日志（对应后端 aspect 中的日志切面）
      if (import.meta.env.DEV) {
        console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)
      }

      // 自动携带 Token（对应后端 JWT 认证）
      const token = localStorageUtil.get<string>(appConfig.tokenKey, '')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // 设置 Content-Type
      if (config.headers && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json; charset=utf-8'
      }

      return config
    },
    (error: AxiosError) => {
      console.error('[Request Interceptor Error]', error)
      return Promise.reject(error)
    },
  )
}

/**
 * 响应拦截器 - 统一处理响应和错误
 * 对应后端 @RestControllerAdvice 全局异常处理
 */
export function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    // 成功响应拦截
    (response: AxiosResponse<ApiResult>) => {
      const { data, config } = response

      // 记录响应日志（对应后端日志切面）
      if (import.meta.env.DEV) {
        console.debug(`[API Response] ${config.method?.toUpperCase()} ${config.url}`, data)
      }

      // 业务状态码非成功 → 当作错误处理（对应后端 BusinessException）
      if (data.code !== BusinessCode.SUCCESS && data.code !== BusinessCode.CREATED) {
        const error = new Error(data.message || '业务处理失败') as Error & { code: number }
        error.code = data.code
        return Promise.reject(error)
      }

      // 直接返回 data 字段，调用方直接拿到 ApiResult
      return response
    },
    // 错误响应拦截（对应后端全局异常处理器）
    (error: AxiosError<ApiResult>) => {
      // 记录错误日志（对应后端 log.error）
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })

      // 401 未认证 → 清除 Token 并跳转登录
      if (error.response?.status === 401) {
        localStorageUtil.remove(appConfig.tokenKey)
        localStorageUtil.remove(appConfig.refreshTokenKey)
        // 触发全局跳转（由路由守卫处理）
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }

      // 解析为用户友好的错误消息
      const message = parseAxiosError(error)
      const enhanced = new Error(message) as Error & { code?: number; original?: AxiosError }
      enhanced.code = error.response?.data?.code ?? error.response?.status
      enhanced.original = error
      return Promise.reject(enhanced)
    },
  )
}
