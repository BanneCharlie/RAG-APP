/**
 * 认证组合式函数
 * 对应后端的 AuthService，封装登录/注册/登出的 UI 交互逻辑
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginDto } from '@/types/dto/login.dto'
import type { RegisterDto } from '@/types/dto/login.dto'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const loading = ref(false)
  const errorMessage = ref('')

  /**
   * 登录（对应后端 AuthService.login）
   */
  async function login(loginDto: LoginDto, redirect?: string): Promise<void> {
    loading.value = true
    errorMessage.value = ''

    try {
      await authStore.login(loginDto)
      // 登录成功 → 跳转目标页面或首页
      const redirectPath = redirect || '/dashboard'
      await router.push(redirectPath)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '登录失败，请稍后重试'
      errorMessage.value = msg
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 注册（对应后端 AuthService.register）
   */
  async function register(registerDto: RegisterDto): Promise<void> {
    loading.value = true
    errorMessage.value = ''

    try {
      await authStore.register(registerDto)
      // 注册成功 → 跳转登录页
      await router.push({ path: '/auth/login', query: { registered: 'true' } })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '注册失败，请稍后重试'
      errorMessage.value = msg
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 登出（对应后端 AuthService.logout）
   */
  async function logout(): Promise<void> {
    loading.value = true

    try {
      await authStore.logout()
      await router.push('/auth/login')
    } catch {
      // 强制登出
      authStore.clearAuth()
      await router.push('/auth/login')
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errorMessage,
    login,
    register,
    logout,
  }
}
