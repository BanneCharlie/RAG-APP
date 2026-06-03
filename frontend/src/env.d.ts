/// <reference types="vite/client" />

/**
 * 环境变量类型声明
 * 对应后端的 application-{profile}.yml 多环境配置
 */
interface ImportMetaEnv {
  /** 应用名称 */
  readonly VITE_APP_NAME: string
  /** 应用版本 */
  readonly VITE_APP_VERSION: string
  /** API 基础路径 */
  readonly VITE_API_BASE_URL: string
  /** 请求超时时间（毫秒） */
  readonly VITE_REQUEST_TIMEOUT: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
