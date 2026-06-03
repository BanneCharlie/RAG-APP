/**
 * 全局常量定义（对应后端 Constants.java）
 */

/** 正则表达式 */
export const REGEX = {
  /** 手机号 */
  PHONE: /^1[3-9]\d{9}$/,

  /** 邮箱 */
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  /** 用户名（字母开头，4-32位字母数字下划线） */
  USERNAME: /^[a-zA-Z][a-zA-Z0-9_]{3,31}$/,

  /** 密码（至少8位，包含字母和数字） */
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,

  /** URL */
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/,

  /** IP 地址 */
  IP: /^(\d{1,3}\.){3}\d{1,3}$/,
} as const

/** 用户状态映射 */
export const USER_STATUS_MAP = {
  ACTIVE: { label: '正常', color: 'success' },
  DISABLED: { label: '禁用', color: 'danger' },
  LOCKED: { label: '锁定', color: 'warning' },
} as const

/** 性别选项 */
export const GENDER_OPTIONS = [
  { value: 'MALE', label: '男' },
  { value: 'FEMALE', label: '女' },
  { value: 'OTHER', label: '其他' },
] as const

/** 存储键名 */
export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  PERMISSIONS: 'permissions',
  ROLES: 'roles',
  SETTINGS: 'app_settings',
  LANGUAGE: 'app_language',
  THEME: 'app_theme',
} as const

/** 日志级别（对应后端日志级别） */
export const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  TRACE: 'TRACE',
} as const
