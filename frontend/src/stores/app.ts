/**
 * 应用全局状态管理
 *
 * 职责：
 * - 侧边栏折叠/展开
 * - 主题切换
 * - 全局加载状态
 * - 页面标题
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ThemeMode = 'light' | 'dark'
export type Language = 'zh-CN' | 'en-US'

export const useAppStore = defineStore('app', () => {
  // ===== State =====
  /** 侧边栏是否折叠 */
  const sidebarCollapsed = ref(false)

  /** 主题模式 */
  const theme = ref<ThemeMode>('light')

  /** 当前语言 */
  const language = ref<Language>('zh-CN')

  /** 全局加载中 */
  const globalLoading = ref(false)

  /** 全局加载提示文字 */
  const loadingText = ref('加载中...')

  /** 页面标题 */
  const pageTitle = ref('')

  // ===== Getters =====
  const sidebarWidth = computed(() => (sidebarCollapsed.value ? '64px' : '220px'))

  const isDarkMode = computed(() => theme.value === 'dark')

  // ===== Actions =====

  /** 切换侧边栏折叠 */
  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /** 设置侧边栏折叠 */
  function setSidebarCollapsed(collapsed: boolean): void {
    sidebarCollapsed.value = collapsed
  }

  /** 切换主题 */
  function toggleTheme(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  /** 设置主题 */
  function setTheme(mode: ThemeMode): void {
    theme.value = mode
    document.documentElement.setAttribute('data-theme', mode)
  }

  /** 设置页面标题 */
  function setPageTitle(title: string): void {
    pageTitle.value = title
    document.title = title ? `${title} - ${import.meta.env.VITE_APP_NAME || 'RAG APP'}` : 'RAG APP'
  }

  /** 显示全局加载 */
  function showLoading(text?: string): void {
    globalLoading.value = true
    if (text) loadingText.value = text
  }

  /** 隐藏全局加载 */
  function hideLoading(): void {
    globalLoading.value = false
    loadingText.value = '加载中...'
  }

  return {
    // State
    sidebarCollapsed,
    theme,
    language,
    globalLoading,
    loadingText,
    pageTitle,
    // Getters
    sidebarWidth,
    isDarkMode,
    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    toggleTheme,
    setTheme,
    setPageTitle,
    showLoading,
    hideLoading,
  }
})
