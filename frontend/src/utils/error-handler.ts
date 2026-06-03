/**
 * 全局错误处理器
 * 对应后端 @RestControllerAdvice + @ExceptionHandler
 */
import type { AxiosError } from 'axios'
import type { ApiResult } from '@/types/api'
import { BusinessCode, HttpStatus } from '@/types/api'

/** 业务错误映射（对应后端 BusinessException 的 message） */
const BUSINESS_ERROR_MAP: Record<number, string> = {
  [BusinessCode.VALIDATION_FAILED]: '请求参数校验失败',
  [BusinessCode.UNAUTHORIZED]: '未登录或登录已过期，请重新登录',
  [BusinessCode.FORBIDDEN]: '您没有权限执行此操作',
  [BusinessCode.NOT_FOUND]: '请求的资源不存在',
  [BusinessCode.BUSINESS_ERROR]: '业务处理失败',
  [BusinessCode.SERVER_ERROR]: '服务器内部错误，请稍后重试',
}

/** HTTP 状态码错误映射 */
const HTTP_ERROR_MAP: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: '请求参数错误',
  [HttpStatus.UNAUTHORIZED]: '认证失败，请重新登录',
  [HttpStatus.FORBIDDEN]: '无权限访问',
  [HttpStatus.NOT_FOUND]: '请求的资源不存在',
  [HttpStatus.METHOD_NOT_ALLOWED]: '请求方法不允许',
  [HttpStatus.CONFLICT]: '请求冲突',
  [HttpStatus.UNPROCESSABLE_ENTITY]: '请求无法处理',
  [HttpStatus.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后重试',
  [HttpStatus.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [HttpStatus.BAD_GATEWAY]: '网关错误',
  [HttpStatus.SERVICE_UNAVAILABLE]: '服务暂不可用',
}

/** 网络错误信息 */
const NETWORK_ERROR_MESSAGE = '网络连接异常，请检查网络后重试'
const TIMEOUT_ERROR_MESSAGE = '请求超时，请稍后重试'
const UNKNOWN_ERROR_MESSAGE = '发生未知错误'

/** 错误回调类型 */
export type ErrorCallback = (message: string, code?: number) => void

/** 默认错误回调（可被全局替换，如接入 UI 提示） */
let globalErrorCallback: ErrorCallback = (message) => {
  console.error('[Global Error]', message)
}

/**
 * 设置全局错误回调
 */
export function setGlobalErrorCallback(callback: ErrorCallback): void {
  globalErrorCallback = callback
}

/**
 * 解析 Axios 错误，返回用户友好的错误信息
 * 对应后端全局异常处理器的处理链：
 *   MethodArgumentNotValidException → ConstraintViolationException → BusinessException → Exception
 */
export function parseAxiosError(error: AxiosError<ApiResult>): string {
  // 1. 无响应（网络断开/超时）
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return TIMEOUT_ERROR_MESSAGE
    }
    return NETWORK_ERROR_MESSAGE
  }

  const { status, data } = error.response

  // 2. 后端返回了业务错误码（对应 BusinessException）
  if (data?.code && data.code !== BusinessCode.SUCCESS) {
    // 优先使用后端返回的 message（对应后端异常中的 message）
    if (data.message) {
      return data.message
    }
    // 根据业务码查找预设消息
    return BUSINESS_ERROR_MAP[data.code] || UNKNOWN_ERROR_MESSAGE
  }

  // 3. 根据 HTTP 状态码返回对应消息
  return HTTP_ERROR_MAP[status] || UNKNOWN_ERROR_MESSAGE
}

/**
 * 触发全局错误处理
 * 对应后端日志记录 + 返回统一错误响应
 */
export function handleError(error: AxiosError<ApiResult>): void {
  const message = parseAxiosError(error)

  // 记录错误日志（对应后端 log.error）
  console.error('[Error Handler]', {
    message,
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    code: error.response?.data?.code,
    timestamp: new Date().toISOString(),
  })

  // 特殊处理：401 未认证（对应后端 Security 拦截）
  if (error.response?.status === HttpStatus.UNAUTHORIZED) {
    // 触发登出逻辑（由调用方决定是否执行）
    globalErrorCallback(message, HttpStatus.UNAUTHORIZED)
    return
  }

  // 特殊处理：403 无权限（对应后端 @PreAuthorize）
  if (error.response?.status === HttpStatus.FORBIDDEN) {
    globalErrorCallback(message, HttpStatus.FORBIDDEN)
    return
  }

  // 通用错误提示
  globalErrorCallback(message, error.response?.status)
}
