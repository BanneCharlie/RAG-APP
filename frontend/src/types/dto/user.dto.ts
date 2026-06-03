/**
 * 用户创建 DTO（对应后端 CreateUserRequest）
 */
export interface CreateUserDto {
  username: string
  password: string
  nickname: string
  email: string
  phone?: string
  roles?: number[]
}

/**
 * 用户更新 DTO（对应后端 UpdateUserRequest）
 */
export interface UpdateUserDto {
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  status?: string
  roles?: number[]
}

/**
 * 用户查询参数 DTO（对应后端 UserQueryParam）
 */
export interface UserQueryDto {
  username?: string
  nickname?: string
  email?: string
  status?: string
  roleId?: number
  startDate?: string
  endDate?: string
  page?: number
  size?: number
  sort?: string
  order?: 'asc' | 'desc'
}

/**
 * 用户分页响应 DTO
 */
export interface UserPageDto {
  records: UserListItem[]
  total: number
  current: number
  size: number
  pages: number
}

/**
 * 用户列表项
 */
export interface UserListItem {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  status: string
  roleNames: string[]
  createdAt: string
  updatedAt: string
}
