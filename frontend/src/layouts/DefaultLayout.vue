<template>
  <div class="default-layout">
    <!-- 侧边栏 -->
    <aside
      class="sidebar"
      :style="{ width: appStore.sidebarWidth }"
    >
      <div class="sidebar-logo">
        <h2 v-show="!appStore.sidebarCollapsed">RAG APP</h2>
        <h2 v-show="appStore.sidebarCollapsed">R</h2>
      </div>
      <nav class="sidebar-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span v-show="!appStore.sidebarCollapsed" class="menu-label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主区域 -->
    <div class="main-area" :style="{ marginLeft: appStore.sidebarWidth }">
      <!-- 顶部导航栏 -->
      <header class="navbar">
        <div class="navbar-left">
          <button class="collapse-btn" @click="appStore.toggleSidebar">
            {{ appStore.sidebarCollapsed ? '☰' : '✕' }}
          </button>
          <span class="page-title">{{ appStore.pageTitle }}</span>
        </div>
        <div class="navbar-right">
          <button class="theme-btn" @click="appStore.toggleTheme">
            {{ appStore.isDarkMode ? '☀️' : '🌙' }}
          </button>
          <span class="user-info">{{ userStore.currentUser?.username || '用户' }}</span>
          <button class="logout-btn" @click="handleLogout">退出</button>
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore, useAuthStore } from '@/stores'
import { useAuth } from '@/composables/useAuth'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useAuthStore()
const { logout } = useAuth()

const menuItems = [
  { path: '/dashboard', label: '仪表盘', icon: '📊' },
  { path: '/user', label: '用户管理', icon: '👤' },
]

function isActive(path: string): boolean {
  return route.path.startsWith(path)
}

async function handleLogout(): Promise<void> {
  await logout()
}
</script>

<style scoped lang="scss">
.default-layout {
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: $sidebar-bg;
  color: $sidebar-text;
  z-index: $z-index-sidebar;
  @include transition(width);

  overflow: hidden;

  .sidebar-logo {
    height: $navbar-height;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    h2 {
      font-size: 18px;
      color: #fff;
      white-space: nowrap;
    }
  }

  .sidebar-menu {
    padding: $spacing-sm 0;

    .menu-item {
      display: flex;
      align-items: center;
      padding: $spacing-base $spacing-md;
      color: $sidebar-text;
      text-decoration: none;
      cursor: pointer;
      @include transition;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
      }

      &.active {
        color: $sidebar-active-text;
        background: rgba(64, 158, 255, 0.1);
      }

      .menu-icon {
        margin-right: $spacing-sm;
        flex-shrink: 0;
      }

      .menu-label {
        white-space: nowrap;
      }
    }
  }
}

.navbar {
  height: $navbar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-md;
  background: $bg-white;
  border-bottom: 1px solid $border-lighter;
  box-shadow: $shadow-sm;

  .navbar-left {
    display: flex;
    align-items: center;
    gap: $spacing-base;
  }

  .collapse-btn,
  .theme-btn {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: $radius-base;
    @include transition;

    &:hover {
      background: $bg-base;
    }
  }

  .page-title {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: $spacing-base;
  }

  .user-info {
    font-size: $font-size-sm;
    color: $text-regular;
  }

  .logout-btn {
    font-size: $font-size-sm;
    color: $text-secondary;
    background: none;
    border: 1px solid $border-base;
    border-radius: $radius-base;
    padding: 2px 12px;
    cursor: pointer;
    @include transition;

    &:hover {
      color: $danger-color;
      border-color: $danger-color;
    }
  }
}

.content {
  padding: $spacing-lg;
  min-height: calc(100vh - #{$navbar-height});
}
</style>
