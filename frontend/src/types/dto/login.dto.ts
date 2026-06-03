/**
 * 登录请求 DTO（对应后端 LoginRequest）
 */
export interface LoginDto {
  username: string
  password: string
  captcha?: string
  rememberMe?: boolean
}

/**
 * 注册请求 DTO（对应后端 RegisterRequest）
 */
export interface RegisterDto {
  username: string
  password: string
  confirmPassword: string
  email: string
  nickname?: string
  phone?: string
}

/**
 * 刷新令牌 DTO（对应后端 RefreshTokenRequest）
 */
export interface RefreshTokenDto {
  refreshToken: string
}
