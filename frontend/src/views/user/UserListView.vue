<template>
  <div class="user-list-view">
    <h2 class="page-title">用户列表</h2>

    <!-- 搜索区域 -->
    <div class="search-bar">
      <input
        v-model="searchParams.username"
        type="text"
        placeholder="用户名"
        class="search-input"
        @keyup.enter="search"
      />
      <input
        v-model="searchParams.email"
        type="text"
        placeholder="邮箱"
        class="search-input"
        @keyup.enter="search"
      />
      <select v-model="searchParams.status" class="search-select">
        <option value="">全部状态</option>
        <option value="ACTIVE">正常</option>
        <option value="DISABLED">禁用</option>
        <option value="LOCKED">锁定</option>
      </select>
      <button class="btn btn-primary" @click="search">查 询</button>
      <button class="btn btn-default" @click="resetSearch">重 置</button>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-bar">
      <button class="btn btn-primary" @click="handleCreate">新增用户</button>
    </div>

    <!-- 列表区域 -->
    <div class="table-container">
      <div v-if="loading" class="loading-overlay">加载中...</div>

      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>昵称</th>
            <th>邮箱</th>
            <th>手机号</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0 && !loading">
            <td colspan="8" class="empty-row">暂无数据</td>
          </tr>
          <tr v-for="item in list" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.nickname || '-' }}</td>
            <td>{{ item.email || '-' }}</td>
            <td>{{ item.phone || '-' }}</td>
            <td>
              <span class="status-tag" :class="item.status.toLowerCase()">
                {{ statusMap[item.status] || item.status }}
              </span>
            </td>
            <td>{{ formatDate(item.createdAt) }}</td>
            <td class="action-cell">
              <button class="btn-text" @click="router.push(`/user/${item.id}`)">查看</button>
              <button class="btn-text" @click="handleEdit(item)">编辑</button>
              <button class="btn-text danger" @click="handleDelete(item)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页 -->
      <div class="pagination">
        <span class="page-info">
          共 {{ pagination.total }} 条，第 {{ pagination.page! + 1 }}/{{ Math.max(1, pagination.pages) }} 页
        </span>
        <div class="page-actions">
          <button
            :disabled="pagination.page === 0"
            @click="handlePageChange(pagination.page! - 1)"
          >
            上一页
          </button>
          <button
            :disabled="pagination.page! + 1 >= pagination.pages"
            @click="handlePageChange(pagination.page! + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePagination } from '@/composables/usePagination'
import { listUsers, deleteUser } from '@/api/modules/user'
import { formatDate } from '@/utils/format'
import type { UserListItem } from '@/types/dto/user.dto'

const router = useRouter()

const statusMap: Record<string, string> = {
  ACTIVE: '正常',
  DISABLED: '禁用',
  LOCKED: '锁定',
}

const {
  list,
  pagination,
  loading,
  queryParams: searchParams,
  search,
  fetchData,
  reset,
  handlePageChange,
  handleSizeChange,
} = usePagination<UserListItem>(
  async (params) => {
    const res = await listUsers(params)
    return res.data
  },
  { page: 0, size: 10 },
)

function resetSearch(): void {
  reset()
  fetchData()
}

function handleCreate(): void {
  // TODO: 跳转新增用户页或打开弹窗
  console.log('新增用户')
}

function handleEdit(user: UserListItem): void {
  router.push(`/user/${user.id}`)
}

async function handleDelete(user: UserListItem): Promise<void> {
  if (!window.confirm(`确定删除用户「${user.username}」吗？`)) return
  try {
    await deleteUser(user.id)
    fetchData()
  } catch {
    // 错误由全局处理器处理
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.page-title {
  font-size: $font-size-xl;
  font-weight: 600;
  margin-bottom: $spacing-lg;
  color: $text-primary;
}

.search-bar {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: $spacing-md;
}

.search-input,
.search-select {
  padding: 6px 12px;
  border: 1px solid $border-base;
  border-radius: $radius-base;
  font-size: $font-size-sm;
  outline: none;
  min-width: 150px;

  &:focus {
    border-color: $primary-color;
  }

  &::placeholder {
    color: $text-placeholder;
  }
}

.btn {
  padding: 6px 16px;
  border-radius: $radius-base;
  font-size: $font-size-sm;
  cursor: pointer;
  border: 1px solid transparent;
  @include transition;

  &-primary {
    background: $primary-color;
    color: #fff;
    border-color: $primary-color;

    &:hover {
      background: color.adjust($primary-color, $lightness: -8%);
    }
  }

  &-default {
    background: $bg-white;
    color: $text-regular;
    border-color: $border-base;

    &:hover {
      color: $primary-color;
      border-color: $primary-color;
    }
  }
}

.table-container {
  position: relative;
  overflow-x: auto;
}

.loading-overlay {
  @include fill;
  @include flex-center;
  background: rgba(255, 255, 255, 0.7);
  z-index: 10;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px 12px;
    text-align: left;
    font-size: $font-size-sm;
    border-bottom: 1px solid $border-lighter;
  }

  th {
    background: $bg-base;
    color: $text-regular;
    font-weight: 600;
    white-space: nowrap;
  }

  td {
    color: $text-primary;
  }

  tbody tr {
    @include transition;

    &:hover {
      background: $bg-base;
    }
  }

  .empty-row {
    text-align: center;
    padding: $spacing-2xl;
    color: $text-secondary;
  }
}

.status-tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: $radius-round;
  font-size: $font-size-xs;
  font-weight: 500;

  &.active { background: #f0f9eb; color: $success-color; }
  &.disabled { background: #fef0f0; color: $danger-color; }
  &.locked { background: #fdf6ec; color: $warning-color; }
}

.action-cell {
  display: flex;
  gap: $spacing-sm;
}

.btn-text {
  background: none;
  border: none;
  color: $primary-color;
  cursor: pointer;
  font-size: $font-size-sm;
  padding: 2px 4px;

  &:hover {
    text-decoration: underline;
  }

  &.danger {
    color: $danger-color;
  }
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-base 0;
  font-size: $font-size-sm;
  color: $text-secondary;

  .page-actions {
    display: flex;
    gap: $spacing-sm;

    button {
      padding: 4px 12px;
      border: 1px solid $border-base;
      background: $bg-white;
      border-radius: $radius-base;
      cursor: pointer;
      font-size: $font-size-sm;
      @include transition;

      &:hover:not(:disabled) {
        color: $primary-color;
        border-color: $primary-color;
      }

      &:disabled {
        color: $text-placeholder;
        cursor: not-allowed;
      }
    }
  }
}
</style>
