/**
 * 请求组合式函数
 * 封装异步请求的 loading、error、data 状态管理
 * 对应后端的 Service 调用模式
 */
import { ref, type Ref, type UnwrapRef } from 'vue'

export type AsyncRequest<T> = () => Promise<T>

export interface UseRequestReturn<T> {
  /** 响应数据 */
  data: Ref<T | null>
  /** 加载中 */
  loading: Ref<boolean>
  /** 错误信息 */
  error: Ref<string>
  /** 执行请求 */
  execute: (...args: unknown[]) => Promise<T | null>
  /** 重置状态 */
  reset: () => void
}

/**
 * 通用异步请求封装
 * @param requestFn 请求函数
 * @param immediate 是否立即执行
 *
 * @example
 * ```ts
 * const { data, loading, error } = useRequest(() => listUsers({ page: 0, size: 10 }))
 * ```
 */
export function useRequest<T>(
  requestFn: AsyncRequest<T>,
  immediate: boolean = false,
): UseRequestReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref('')

  async function execute(..._args: unknown[]): Promise<T | null> {
    loading.value = true
    error.value = ''

    try {
      const result = await requestFn()
      data.value = result as UnwrapRef<T>
      return result
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '请求失败'
      error.value = msg
      return null
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    data.value = null
    loading.value = false
    error.value = ''
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}
