/**
 * 格式化工具函数
 * 对应后端 util 层中的格式化工具
 */

/**
 * 格式化日期时间
 * @param date 日期字符串或 Date 对象
 * @param format 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 */
export function formatDate(
  date: string | Date | null | undefined,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date

  if (Number.isNaN(d.getTime())) return '-'

  const map: Record<string, number> = {
    YYYY: d.getFullYear(),
    MM: d.getMonth() + 1,
    DD: d.getDate(),
    HH: d.getHours(),
    mm: d.getMinutes(),
    ss: d.getSeconds(),
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) =>
    String(map[match]).padStart(2, '0'),
  )
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

/**
 * 格式化手机号：138****1234
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化邮箱：u***@example.com
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return '-'
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  return `${name[0]}***@${domain}`
}

/**
 * 格式化金额，保留两位小数
 */
export function formatMoney(amount: number, currency: string = '¥'): string {
  return `${currency}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}
