/**
 * 用户实体（对应后端 User Entity）
 */
export interface User {
  id: number
  username: string
  nickname: string
  email: string
  phone?: string
  avatar?: string
  status: UserStatus
  roles: Role[]
  createdAt: string
  updatedAt: string
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  /** 正常 */
  ACTIVE = 'ACTIVE',
  /** 禁用 */
  DISABLED = 'DISABLED',
  /** 锁定 */
  LOCKED = 'LOCKED',
}

/**
 * 角色模型（对应后端 Role Entity）
 */
export interface Role {
  id: number
  name: string
  code: string
  description?: string
}

/**
 * 权限模型（对应后端 Permission Entity）
 */
export interface Permission {
  id: number
  name: string
  code: string
  path?: string
  method?: string
  parentId?: number
  type: 'MENU' | 'BUTTON' | 'API'
}
