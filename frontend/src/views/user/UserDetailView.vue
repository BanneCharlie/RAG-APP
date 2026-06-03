<template>
  <div class="user-detail-view">
    <div class="page-header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h2 class="page-title">用户详情</h2>
    </div>

    <div v-if="loading" class="loading-state">加载中...</div>

    <div v-else-if="error" class="error-state">{{ error }}</div>

    <div v-else class="detail-content">
      <div class="card-container info-section">
        <h3>基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>用户 ID</label>
            <span>{{ user?.id ?? '-' }}</span>
          </div>
          <div class="info-item">
            <label>用户名</label>
            <span>{{ user?.username ?? '-' }}</span>
          </div>
          <div class="info-item">
            <label>昵称</label>
            <span>{{ user?.nickname ?? '-' }}</span>
          </div>
          <div class="info-item">
            <label>邮箱</label>
            <span>{{ user?.email ?? '-' }}</span>
          </div>
          <div class="info-item">
            <label>手机号</label>
            <span>{{ user?.phone ?? '-' }}</span>
          </div>
          <div class="info-item">
            <label>状态</label>
            <span>{{ user?.status ?? '-' }}</span>
          </div>
          <div class="info-item">
            <label>创建时间</label>
            <span>{{ user?.createdAt ? formatDate(user.createdAt) : '-' }}</span>
          </div>
          <div class="info-item">
            <label>更新时间</label>
            <span>{{ user?.updatedAt ? formatDate(user.updatedAt) : '-' }}</span>
          </div>
        </div>
      </div>

      <div class="card-container role-section">
        <h3>角色信息</h3>
        <div v-if="user?.roles?.length" class="role-list">
          <span v-for="role in user.roles" :key="role.id" class="role-tag">
            {{ role.name }}
          </span>
        </div>
        <span v-else class="text-secondary">暂无角色</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUserById } from '@/api/modules/user'
import { formatDate } from '@/utils/format'
import type { User } from '@/types/models/user'

const router = useRouter()
const route = useRoute()
const userId = Number(route.params.id)

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (!userId || Number.isNaN(userId)) {
    error.value = '无效的用户 ID'
    return
  }

  loading.value = true
  try {
    const res = await getUserById(userId)
    user.value = res.data
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : '加载用户信息失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  margin-bottom: $spacing-lg;

  .back-btn {
    background: none;
    border: none;
    font-size: $font-size-base;
    color: $primary-color;
    cursor: pointer;
    padding: 4px 8px;

    &:hover {
      text-decoration: underline;
    }
  }

  .page-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

.loading-state,
.error-state {
  @include card;
  padding: $spacing-2xl;
  text-align: center;
  color: $text-secondary;
}

.error-state {
  color: $danger-color;
}

.info-section,
.role-section {
  h3 {
    font-size: $font-size-md;
    font-weight: 600;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-lighter;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-md;
}

.info-item {
  label {
    display: block;
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-bottom: 2px;
  }

  span {
    font-size: $font-size-base;
    color: $text-primary;
  }
}

.role-list {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.role-tag {
  display: inline-block;
  padding: 2px 10px;
  background: #ecf5ff;
  color: $primary-color;
  border-radius: $radius-round;
  font-size: $font-size-xs;
}
</style>
