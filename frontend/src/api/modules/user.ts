/**
 * 用户管理 API 模块
 * 对应后端 UserController
 *
 * 命名规范：
 *   list     → GET    /api/v1/users?page=0&size=10
 *   detail   → GET    /api/v1/users/{id}
 *   create   → POST   /api/v1/users
 *   update   → PUT    /api/v1/users/{id}
 *   patch    → PATCH  /api/v1/users/{id}
 *   delete   → DELETE /api/v1/users/{id}
 */
import httpClient from '@/api/http'
import type { ApiResult, PageResult, PageParams } from '@/types/api'
import type { CreateUserDto, UpdateUserDto, UserQueryDto, UserListItem } from '@/types/dto/user.dto'
import type { User } from '@/types/models/user'

/** 基础路径 */
const BASE_PATH = '/users'

/**
 * 分页查询用户列表
 * GET /api/v1/users?page=0&size=10&username=xxx
 */
export function listUsers(
  params: UserQueryDto & PageParams,
): Promise<ApiResult<PageResult<UserListItem>>> {
  return httpClient.get(BASE_PATH, { params })
}

/**
 * 查询用户详情
 * GET /api/v1/users/{id}
 */
export function getUserById(id: number): Promise<ApiResult<User>> {
  return httpClient.get(`${BASE_PATH}/${id}`)
}

/**
 * 新增用户
 * POST /api/v1/users
 */
export function createUser(data: CreateUserDto): Promise<ApiResult<User>> {
  return httpClient.post(BASE_PATH, data)
}

/**
 * 全量更新用户
 * PUT /api/v1/users/{id}
 */
export function updateUser(id: number, data: UpdateUserDto): Promise<ApiResult<User>> {
  return httpClient.put(`${BASE_PATH}/${id}`, data)
}

/**
 * 部分更新用户
 * PATCH /api/v1/users/{id}
 */
export function patchUser(id: number, data: Partial<UpdateUserDto>): Promise<ApiResult<User>> {
  return httpClient.patch(`${BASE_PATH}/${id}`, data)
}

/**
 * 删除用户
 * DELETE /api/v1/users/{id}
 */
export function deleteUser(id: number): Promise<ApiResult<void>> {
  return httpClient.delete(`${BASE_PATH}/${id}`)
}

/**
 * 批量删除用户
 * DELETE /api/v1/users/batch
 */
export function batchDeleteUsers(ids: number[]): Promise<ApiResult<void>> {
  return httpClient.delete(`${BASE_PATH}/batch`, { data: { ids } })
}

/**
 * 切换用户状态
 * PATCH /api/v1/users/{id}/status
 */
export function toggleUserStatus(id: number, status: string): Promise<ApiResult<User>> {
  return httpClient.patch(`${BASE_PATH}/${id}/status`, { status })
}
