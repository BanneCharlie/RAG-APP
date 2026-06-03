/**
 * 统一 API 响应结构（对应后端 Result<T>）
 */
export interface ApiResult<T = never> {
  /** 状态码，200 表示成功 */
  code: number
  /** 提示信息 */
  message: string
  /** 响应数据 */
  data: T
  /** 时间戳 */
  timestamp: number
}

/**
 * 分页响应结构（对应后端 Page<T> 或 PageDTO）
 */
export interface PageResult<T> {
  /** 数据列表 */
  records: T[]
  /** 总记录数 */
  total: number
  /** 当前页数（从 0 开始，匹配后端约定） */
  current: number
  /** 每页大小 */
  size: number
  /** 总页数 */
  pages: number
}

/**
 * 分页查询参数
 */
export interface PageParams {
  /** 当前页（从 0 开始） */
  page?: number
  /** 每页大小 */
  size?: number
  /** 排序字段 */
  sort?: string
  /** 排序方向 */
  order?: 'asc' | 'desc'
}

/**
 * HTTP 状态码枚举
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * 业务状态码（与后端 Result 的 code 对应）
 */
export enum BusinessCode {
  SUCCESS = 200,
  CREATED = 201,
  /** 参数校验失败 */
  VALIDATION_FAILED = 400,
  /** 未认证 */
  UNAUTHORIZED = 401,
  /** 无权限 */
  FORBIDDEN = 403,
  /** 资源不存在 */
  NOT_FOUND = 404,
  /** 业务异常 */
  BUSINESS_ERROR = 409,
  /** 服务端错误 */
  SERVER_ERROR = 500,
}

/**
 * 表格排序参数
 */
export interface SortParams {
  prop: string
  order: 'ascending' | 'descending'
}
