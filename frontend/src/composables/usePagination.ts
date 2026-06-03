/**
 * 分页查询组合式函数
 * 对应后端分页查询模式（Page + PageParams）
 */
import { reactive, ref, type Ref } from 'vue'
import type { PageResult, PageParams } from '@/types/api'

export interface PaginationState extends PageParams {
  total: number
  pages: number
}

export interface UsePaginationReturn<T> {
  /** 数据列表 */
  list: Ref<T[]>
  /** 分页状态 */
  pagination: PaginationState
  /** 加载中 */
  loading: Ref<boolean>
  /** 查询参数 */
  queryParams: Record<string, unknown>
  /** 执行查询 */
  fetchData: () => Promise<void>
  /** 搜索（重置页码后查询） */
  search: () => void
  /** 重置 */
  reset: () => void
  /** 处理页码变化 */
  handlePageChange: (page: number) => void
  /** 处理每页大小变化 */
  handleSizeChange: (size: number) => void
}

/**
 * 分页查询封装
 * @param fetchFn 分页查询函数，返回 PageResult<T>
 * @param initialParams 初始查询参数
 *
 * @example
 * ```ts
 * const { list, pagination, loading, search } = usePagination(
 *   (params) => listUsers({ ...params, username: 'admin' }),
 *   { size: 20 }
 * )
 * ```
 */
export function usePagination<T>(
  fetchFn: (params: Record<string, unknown>) => Promise<PageResult<T>>,
  initialParams: Record<string, unknown> = {},
): UsePaginationReturn<T> {
  const list = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)

  const pagination = reactive<PaginationState>({
    page: 0,
    size: 10,
    total: 0,
    pages: 0,
  })

  const queryParams = reactive<Record<string, unknown>>({
    ...initialParams,
  })

  async function fetchData(): Promise<void> {
    loading.value = true

    try {
      const params = {
        ...queryParams,
        page: pagination.page,
        size: pagination.size,
      }

      const result = await fetchFn(params)

      list.value = result.records || []
      pagination.total = result.total ?? 0
      pagination.pages = result.pages ?? 0
      pagination.page = result.current ?? pagination.page
    } catch {
      list.value = []
      pagination.total = 0
    } finally {
      loading.value = false
    }
  }

  /** 搜索：重置到第一页后查询 */
  function search(): void {
    pagination.page = 0
    fetchData()
  }

  /** 重置分页和查询参数 */
  function reset(): void {
    pagination.page = 0
    pagination.size = 10
    pagination.total = 0
    pagination.pages = 0
    Object.keys(queryParams).forEach((key) => delete queryParams[key])
    Object.assign(queryParams, { ...initialParams })
    list.value = []
  }

  function handlePageChange(page: number): void {
    pagination.page = page
    fetchData()
  }

  function handleSizeChange(size: number): void {
    pagination.size = size
    pagination.page = 0
    fetchData()
  }

  return {
    list,
    pagination,
    loading,
    queryParams,
    fetchData,
    search,
    reset,
    handlePageChange,
    handleSizeChange,
  }
}
