<template>
  <div class="dashboard-view">
    <h2 class="page-title">仪表盘</h2>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-icon">{{ stat.icon }}</div>
      </div>
    </div>

    <!-- 欢迎区域 -->
    <div class="welcome-card card-container">
      <h3>欢迎回来，{{ userStore.currentUser?.username || '用户' }}</h3>
      <p class="text-secondary mt-sm">
        这是 RAG 智能问答平台的仪表盘首页。您可以通过左侧菜单导航到各个功能模块。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'

const userStore = useAuthStore()

const stats = [
  { label: '用户总数', value: '—', icon: '👤' },
  { label: '文档数量', value: '—', icon: '📄' },
  { label: '知识库', value: '—', icon: '📚' },
  { label: '问答记录', value: '—', icon: '💬' },
]
</script>

<style scoped lang="scss">
.dashboard-view {
  .page-title {
    font-size: $font-size-xl;
    font-weight: 600;
    margin-bottom: $spacing-lg;
    color: $text-primary;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.stat-card {
  @include card;
  padding: $spacing-lg;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  @include transition;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }

  .stat-label {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  .stat-icon {
    position: absolute;
    right: $spacing-md;
    top: $spacing-md;
    font-size: 36px;
    opacity: 0.15;
  }
}

.welcome-card {
  h3 {
    font-size: $font-size-lg;
    font-weight: 600;
    margin-bottom: $spacing-sm;
  }
}
</style>
