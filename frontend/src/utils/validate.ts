/**
 * 校验工具函数（对应后端 Bean Validation）
 */

import { REGEX } from '@/config/constant'

/**
 * 校验手机号
 */
export function isValidPhone(phone: string): boolean {
  return REGEX.PHONE.test(phone)
}

/**
 * 校验邮箱
 */
export function isValidEmail(email: string): boolean {
  return REGEX.EMAIL.test(email)
}

/**
 * 校验用户名（字母开头，4-32位字母数字下划线）
 */
export function isValidUsername(username: string): boolean {
  return REGEX.USERNAME.test(username)
}

/**
 * 校验密码强度（至少8位，包含字母和数字）
 */
export function isValidPassword(password: string): boolean {
  return REGEX.PASSWORD.test(password)
}

/**
 * 校验确认密码是否一致
 */
export function isPasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

/**
 * 校验 URL
 */
export function isValidURL(url: string): boolean {
  return REGEX.URL.test(url)
}

/**
 * 校验 IP 地址
 */
export function isValidIP(ip: string): boolean {
  return REGEX.IP.test(ip)
}

/**
 * 校验非空字符串
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0
}

/**
 * 校验字符串长度范围
 */
export function isValidLength(value: string, min: number, max: number): boolean {
  const len = value.trim().length
  return len >= min && len <= max
}
