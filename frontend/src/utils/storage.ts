/**
 * 存储工具类（封装 localStorage / sessionStorage，支持序列化）
 * 对应后端 util 层
 */

const prefix = 'rag_app_'

/**
 * 安全解析 JSON，解析失败返回默认值
 */
function safeParse<T>(value: string | null, fallback: T): T {
  if (value === null || value === undefined) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

/**
 * localStorage 封装
 */
export const localStorageUtil = {
  get<T>(key: string, fallback: T): T {
    try {
      const value = window.localStorage.getItem(prefix + key)
      return safeParse(value, fallback)
    } catch {
      return fallback
    }
  },

  set(key: string, value: unknown): void {
    try {
      window.localStorage.setItem(prefix + key, JSON.stringify(value))
    } catch (e) {
      console.error('localStorage.setItem error:', e)
    }
  },

  remove(key: string): void {
    try {
      window.localStorage.removeItem(prefix + key)
    } catch (e) {
      console.error('localStorage.removeItem error:', e)
    }
  },

  clear(): void {
    try {
      window.localStorage.clear()
    } catch (e) {
      console.error('localStorage.clear error:', e)
    }
  },
}

/**
 * sessionStorage 封装
 */
export const sessionStorageUtil = {
  get<T>(key: string, fallback: T): T {
    try {
      const value = window.sessionStorage.getItem(prefix + key)
      return safeParse(value, fallback)
    } catch {
      return fallback
    }
  },

  set(key: string, value: unknown): void {
    try {
      window.sessionStorage.setItem(prefix + key, JSON.stringify(value))
    } catch (e) {
      console.error('sessionStorage.setItem error:', e)
    }
  },

  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(prefix + key)
    } catch (e) {
      console.error('sessionStorage.removeItem error:', e)
    }
  },

  clear(): void {
    try {
      window.sessionStorage.clear()
    } catch (e) {
      console.error('sessionStorage.clear error:', e)
    }
  },
}
