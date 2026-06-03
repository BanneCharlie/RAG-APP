<template>
  <div class="login-view">
    <!-- 错误提示 -->
    <transition name="err">
      <div v-if="errorMessage" class="error-bar" key="error">
        <svg class="err-icon" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 6v4M10 13v.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
    </transition>

    <form @submit.prevent="handleLogin" class="login-form">
      <!-- 用户名 -->
      <div
        class="field-group"
        :class="[focusedField === 'username' ? 'focused' : '', form.username ? 'filled' : '']"
        :style="{ animationDelay: '0.08s' }"
      >
        <div class="field-inner">
          <div class="field-bg"></div>
          <input
            id="username"
            v-model="form.username"
            type="text"
            autocomplete="username"
            class="field-input"
            @focus="focusedField = 'username'"
            @blur="focusedField = ''"
          />
          <label for="username" class="field-label">
            <svg class="field-icon" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="5.5" r="3.5" stroke="currentColor" stroke-width="1.3"/>
              <path d="M2.5 17c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            用户名
          </label>
          <div class="field-glow"></div>
        </div>
      </div>

      <!-- 密码 -->
      <div
        class="field-group"
        :class="[focusedField === 'password' ? 'focused' : '', form.password ? 'filled' : '']"
        :style="{ animationDelay: '0.14s' }"
      >
        <div class="field-inner">
          <div class="field-bg"></div>
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            class="field-input"
            @focus="focusedField = 'password'"
            @blur="focusedField = ''"
          />
          <label for="password" class="field-label">
            <svg class="field-icon" viewBox="0 0 18 18" fill="none">
              <rect x="2.5" y="7.5" width="13" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
              <path d="M5.5 7.5V4.5a3.5 3.5 0 017 0v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            密码
          </label>
          <button type="button" class="pw-toggle" @click="showPassword = !showPassword" tabindex="-1">
            <svg v-if="!showPassword" viewBox="0 0 20 20" fill="none" width="16" height="16">
              <path d="M1.5 10s3.5-6 8.5-6 8.5 6 8.5 6-3.5 6-8.5 6-8.5-6-8.5-6z" stroke="currentColor" stroke-width="1.3"/>
              <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.3"/>
            </svg>
            <svg v-else viewBox="0 0 20 20" fill="none" width="16" height="16">
              <path d="M3 3l14 14M9.5 9.5a2 2 0 003 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              <path d="M7 5.3A6.8 6.8 0 0110 4.5c5 0 8.5 5.5 8.5 5.5s-1.3 2.2-3.5 3.7M5.6 6.6C3 8.2 1.5 10 1.5 10s3.5 6 8.5 6a5.8 5.8 0 002.4-.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="field-glow"></div>
        </div>
      </div>

      <!-- 选项 -->
      <div class="options-row" :style="{ animationDelay: '0.2s' }">
        <label class="toggle-apple">
          <input v-model="form.rememberMe" type="checkbox" />
          <span class="toggle-track"><span class="toggle-dot"></span></span>
          <span class="toggle-label">记住我</span>
        </label>
        <router-link to="/auth/register" class="link-under">创建账号</router-link>
      </div>

      <!-- 按钮 -->
      <div class="btn-wrap" :style="{ animationDelay: '0.26s' }">
        <button
          ref="btnRef"
          type="submit"
          class="login-btn"
          :class="{ loading: loading }"
          :disabled="loading || !canSubmit"
          @click="onBtnClick"
        >
          <span class="btn-ripple" ref="rippleRef"></span>
          <span class="btn-content" v-if="!loading">
            <span>登录</span>
            <svg class="btn-arrow" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="btn-content loading-state" v-else>
            <svg class="btn-spinner" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
            </svg>
            <span>正在登录</span>
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { loading, errorMessage, login } = useAuth()
const focusedField = ref<string>('')
const showPassword = ref(false)
const btnRef = ref<HTMLButtonElement | null>(null)
const rippleRef = ref<HTMLSpanElement | null>(null)

const form = reactive({
  username: '',
  password: '',
  rememberMe: false,
})
const canSubmit = computed(() => form.username.length > 0 && form.password.length > 0)

async function handleLogin(): Promise<void> {
  if (!canSubmit.value) return
  await login(
    { username: form.username, password: form.password, rememberMe: form.rememberMe },
    (route.query.redirect as string) || undefined,
  )
}

function onBtnClick(e: MouseEvent): void {
  if (loading.value || !canSubmit.value) return
  const btn = btnRef.value
  const ripple = rippleRef.value
  if (!btn || !ripple) return
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`
  ripple.classList.remove('active')
  void ripple.offsetWidth
  ripple.classList.add('active')
  ripple.addEventListener('animationend', () => ripple.classList.remove('active'), { once: true })
}
</script>

<style scoped lang="scss">
// ============================================================
//  登录 — 浅色高级简约风格
// ============================================================

.login-view { width: 100%; }

// ===== 错误提示 =====
.error-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin-bottom: 20px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  font-size: 13px;
  color: #dc2626;
  line-height: 1.4;
  animation: shakeX 0.4s cubic-bezier(0.36, 0, 0.66, 1);
}
.err-icon { width: 18px; height: 18px; flex-shrink: 0; }

@keyframes shakeX {
  0%, 100% { transform: translateX(0); }
  20%  { transform: translateX(-6px); }
  40%  { transform: translateX(5px); }
  60%  { transform: translateX(-3px); }
  80%  { transform: translateX(2px); }
}
.err-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.err-leave-active { transition: all 0.2s ease; }
.err-enter-from { opacity: 0; transform: translateY(-10px); }
.err-leave-to { opacity: 0; transform: translateY(-6px); }

// ===== 表单字段 =====
.field-group {
  margin-bottom: 20px;
  animation: fieldIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes fieldIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.field-inner { position: relative; }

.field-bg {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.02);
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;

  .focused & {
    border-color: rgba(59, 130, 246, 0.3);
    background: rgba(59, 130, 246, 0.02);
  }
}

.field-glow {
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;

  .focused & {
    opacity: 1;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06), 0 0 24px rgba(59, 130, 246, 0.03);
  }
}

.field-input {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 54px;
  padding: 22px 16px 6px;
  background: transparent;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  color: #1d1d1f;
  outline: none;
  caret-color: rgba(59, 130, 246, 0.7);
  &::placeholder { color: transparent; }
  &:-webkit-autofill {
    -webkit-text-fill-color: #1d1d1f;
    -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.8) inset !important;
  }
}

.field-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.25);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  .field-icon { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.5; transition: opacity 0.3s; }

  .focused & { color: rgba(59, 130, 246, 0.6); .field-icon { opacity: 0.8; } }
  .focused &, .filled & { top: 12px; transform: translateY(0) scale(0.78); }
  .filled & { color: rgba(0, 0, 0, 0.35); }
}

.pw-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.18);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  transition: all 0.25s ease;
  &:hover { color: rgba(0, 0, 0, 0.4); background: rgba(0, 0, 0, 0.03); }
  &:active { transform: translateY(-50%) scale(0.92); }
}

// ===== 选项行 =====
.options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  animation: fieldIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.toggle-apple {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;

  input { position: absolute; opacity: 0; width: 0; height: 0; }

  .toggle-track {
    position: relative;
    width: 44px; height: 26px;
    background: rgba(0, 0, 0, 0.08);
    border-radius: 13px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    flex-shrink: 0;

    .toggle-dot {
      position: absolute; top: 3px; left: 3px;
      width: 20px; height: 20px;
      background: #fff;
      border-radius: 50%;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }
  }

  .toggle-label { font-size: 13px; color: rgba(0, 0, 0, 0.35); transition: color 0.25s; }

  input:checked + .toggle-track {
    background: rgba(59, 130, 246, 0.5);
    .toggle-dot { left: 21px; background: #3b82f6; box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3); }
  }
  input:checked ~ .toggle-label { color: rgba(0, 0, 0, 0.5); }
  &:hover .toggle-track { background: rgba(0, 0, 0, 0.12); }
  input:checked:hover + .toggle-track { background: rgba(59, 130, 246, 0.6); }
}

.link-under {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.25);
  text-decoration: none;
  transition: color 0.25s;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.06);
    transition: background 0.25s;
  }
  &:hover { color: rgba(0, 0, 0, 0.5); &::after { background: rgba(0, 0, 0, 0.15); } }
}

// ===== 按钮 =====
.btn-wrap { animation: fieldIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }

.login-btn {
  position: relative;
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1d1d1f;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s ease,
    opacity 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.005);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 0 40px rgba(0, 0, 0, 0.03);
    background: #000;
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.985);
    transition-duration: 0.08s;
  }

  &:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; transform: none; }

  .btn-arrow { width: 18px; height: 18px; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  &:hover:not(:disabled) .btn-arrow { transform: translateX(4px); }
}

.btn-content {
  display: flex; align-items: center; gap: 8px; position: relative; z-index: 1;
  &.loading-state { gap: 10px; }
}

.btn-spinner {
  width: 20px; height: 20px;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  pointer-events: none;
  transform: scale(0);
  opacity: 0;
  &.active { animation: rippleAnim 0.6s ease-out forwards; }
}
@keyframes rippleAnim {
  0%   { transform: scale(0); opacity: 0.5; }
  100% { transform: scale(4); opacity: 0; }
}

@media (max-width: 480px) {
  .field-input { height: 50px; font-size: 14px; }
  .login-btn { height: 48px; font-size: 15px; }
}
</style>
