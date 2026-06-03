/**
 * 登录凭据
 */
export interface LoginCredentials {
  username: string
  password: string
  /** 验证码（可选） */
  captcha?: string
  /** 记住我 */
  remember?: boolean
}

/**
 * 登录响应
 */
export interface LoginResponse {
  /** JWT token */
  accessToken: string
  /** 刷新 token */
  refreshToken: string
  /** token 类型（Bearer） */
  tokenType: string
  /** 过期时间（秒） */
  expiresIn: number
}

/**
 * 认证状态
 */
export interface AuthState {
  /** 是否已认证 */
  isAuthenticated: boolean
  /** 当前用户 */
  currentUser: User | null
  /** 权限列表 */
  permissions: string[]
  /** 角色列表 */
  roles: string[]
}

/**
 * 令牌载荷（JWT payload）
 */
export interface TokenPayload {
  sub: string       // 用户 ID
  username: string
  roles: string[]
  exp: number
  iat: number
}
