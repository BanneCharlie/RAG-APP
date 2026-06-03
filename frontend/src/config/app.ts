/**
 * 应用全局配置（对应后端 application.yml）
 */
export const appConfig = {
  /** 应用名称 */
  appName: import.meta.env.VITE_APP_NAME || 'RAG APP',

  /** 应用版本 */
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

  /** API 基础路径 */
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',

  /** 请求超时时间（毫秒） */
  requestTimeout: import.meta.env.VITE_REQUEST_TIMEOUT
    ? Number(import.meta.env.VITE_REQUEST_TIMEOUT)
    : 30000,

  /** Token 标识键名 */
  tokenKey: 'access_token',

  /** 刷新 Token 键名 */
  refreshTokenKey: 'refresh_token',

  /** 用户信息存储键名 */
  userKey: 'current_user',

  /** 记住我状态存储键名 */
  rememberKey: 'remember_me',

  /** 分页默认值 */
  pagination: {
    defaultPage: 0,
    defaultSize: 10,
    pageSizes: [10, 20, 50, 100],
  },

  /** 内容类型 */
  contentType: 'application/json; charset=utf-8',
} as const
