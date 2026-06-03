<template>
  <div class="auth-layout" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <!-- ===== Sonoma 风格灵动渐变背景 ===== -->
    <div class="bg-scene" ref="sceneRef">
      <!-- 基础底色 -->
      <div class="bg-base"></div>

      <!-- SVG 动态渐变光晕（多层视差） -->
      <svg class="bg-blobs" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="blobBlur"><feGaussianBlur stdDeviation="80" /></filter>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fafafa" />
            <stop offset="50%" stop-color="#f5f0eb" />
            <stop offset="100%" stop-color="#efe8e0" />
          </linearGradient>
          <!-- 扫描线滤镜 -->
          <filter id="scanline">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="1" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feBlend in="SourceGraphic" in2="gray" mode="overlay" />
          </filter>
        </defs>

        <rect width="1440" height="900" fill="url(#bgGrad)" />

        <!-- 光晕层 — 每层单独响应鼠标 -->
        <g class="parallax-layer" :style="{ transform: `translate(${mouseX * 12}px, ${mouseY * 8}px)` }">
          <circle class="blob blob-1" cx="280" cy="180" r="340" fill="rgba(255, 183, 140, 0.22)" filter="url(#blobBlur)" />
        </g>
        <g class="parallax-layer" :style="{ transform: `translate(${-mouseX * 16}px, ${-mouseY * 10}px)` }">
          <circle class="blob blob-2" cx="1180" cy="160" r="360" fill="rgba(196, 181, 253, 0.18)" filter="url(#blobBlur)" />
        </g>
        <g class="parallax-layer" :style="{ transform: `translate(${mouseX * 8}px, ${-mouseY * 14}px)` }">
          <circle class="blob blob-3" cx="1250" cy="750" r="320" fill="rgba(153, 210, 190, 0.16)" filter="url(#blobBlur)" />
        </g>
        <g class="parallax-layer" :style="{ transform: `translate(${-mouseX * 10}px, ${mouseY * 12}px)` }">
          <circle class="blob blob-4" cx="180" cy="780" r="280" fill="rgba(255, 200, 180, 0.18)" filter="url(#blobBlur)" />
        </g>
        <g class="parallax-layer" :style="{ transform: `translate(${mouseX * 20}px, ${mouseY * 15}px)` }">
          <circle class="blob blob-5" cx="720" cy="450" r="450" fill="rgba(191, 219, 254, 0.12)" filter="url(#blobBlur)" />
        </g>
      </svg>

      <!-- 鼠标聚光灯（跟随光标） -->
      <div
        class="cursor-spotlight"
        :style="{
          opacity: spotlightVisible ? 1 : 0,
          transform: `translate(${rawMouseX - 200}px, ${rawMouseY - 200}px)`,
        }"
      ></div>

      <!-- 科技网格 -->
      <div class="bg-grid"></div>

      <!-- 网格 hover 高亮 -->
      <div
        class="grid-flash"
        :style="{
          opacity: spotlightVisible ? 1 : 0,
          transform: `translate(${rawMouseX}px, ${rawMouseY}px)`,
        }"
      ></div>

      <!-- 底部光带 -->
      <div class="bg-lightbar"></div>
    </div>

    <!-- ===== 玻璃卡片（微视差） ===== -->
    <div
      class="auth-card"
      :style="{ transform: `translate(${mouseX * 3}px, ${mouseY * 2}px)` }"
    >
      <div class="auth-brand">
        <div class="brand-icon-wrap">
          <div class="brand-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="brandBg" x1="0" y1="0" x2="40" y2="40">
                  <stop stop-color="#3b82f6"/>
                  <stop offset="1" stop-color="#6366f1"/>
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="10" fill="url(#brandBg)"/>
              <path d="M12 20l6 6 10-10" stroke="white" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <h1 class="brand-title">{{ appName }}</h1>
        <p class="brand-desc">企业级 RAG 智能问答平台</p>
      </div>

      <div class="auth-content">
        <router-view v-slot="{ Component }">
          <transition name="page-switch" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <div class="auth-footer">
        <span>&copy; {{ year }} {{ appName }}</span>
        <span class="dot">·</span>
        <span>保留所有权利</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { appConfig } from '@/config/app'

const appName = appConfig.appName
const year = new Date().getFullYear()

// ===== 鼠标追踪 =====
const mouseX = ref(0)
const mouseY = ref(0)
const rawMouseX = ref(0)
const rawMouseY = ref(0)
const spotlightVisible = ref(false)

let rafId = 0
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0

function onMouseMove(e: MouseEvent) {
  const { clientX, clientY } = e
  rawMouseX.value = clientX
  rawMouseY.value = clientY
  spotlightVisible.value = true

  // 归一化坐标 [-1, 1]
  targetX = (clientX / window.innerWidth) * 2 - 1
  targetY = (clientY / window.innerHeight) * 2 - 1
}

function onMouseLeave() {
  spotlightVisible.value = false
  targetX = 0
  targetY = 0
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function animate() {
  currentX = lerp(currentX, targetX, 0.08)
  currentY = lerp(currentY, targetY, 0.08)

  // 当接近目标时微调精度
  if (Math.abs(currentX - targetX) > 0.001 || Math.abs(currentY - targetY) > 0.001) {
    mouseX.value = currentX
    mouseY.value = currentY
  }

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  rafId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
})
</script>

<style scoped lang="scss">
// ============================================================
//  Apple Sonoma 风格 — 鼠标追踪视差交互
// ============================================================

.auth-layout {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
  background: #fafafa;
  cursor: default;
}

// ===================================================================
//  背景系统
// ===================================================================
.bg-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.bg-base {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #fafafa 0%, #f3eee9 50%, #ece4db 100%);
}

// SVG 光晕
.bg-blobs {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.parallax-layer {
  will-change: transform;
  transition: transform 0.15s ease-out;
}

.blob {
  will-change: transform;
  animation: blobDrift 16s ease-in-out infinite alternate;
}

.blob-1 { animation-duration: 18s; animation-delay: -2s; }
.blob-2 { animation-duration: 14s; animation-delay: -5s; }
.blob-3 { animation-duration: 20s; animation-delay: -8s; }
.blob-4 { animation-duration: 16s; animation-delay: -3s; }
.blob-5 { animation-duration: 22s; animation-delay: -10s; }

@keyframes blobDrift {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(40px, -30px) scale(1.05); }
  66%  { transform: translate(-20px, 25px) scale(0.95); }
  100% { transform: translate(30px, -15px) scale(1.02); }
}

// ===== 鼠标聚光灯 =====
.cursor-spotlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  pointer-events: none;
  will-change: transform;
  transition: opacity 0.4s ease;
}

// ===== 科技网格 =====
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 70%);
}

// 网格光标高亮
.grid-flash {
  position: absolute;
  top: -120px;
  left: -120px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 60%);
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
  transition: opacity 0.4s ease;
  mix-blend-mode: screen;
}

// 底部光带
.bg-lightbar {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.08), transparent);
  filter: blur(1px);
}

// ===================================================================
//  玻璃卡片
// ===================================================================
.auth-card {
  position: relative;
  z-index: 1;
  width: 420px;
  padding: 44px 40px 28px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(30px) saturate(1.8);
  -webkit-backdrop-filter: blur(30px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 28px;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.02),
    0 20px 60px rgba(0, 0, 0, 0.04),
    0 8px 20px rgba(0, 0, 0, 0.03);
  animation: cardEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  will-change: transform;
  transition: transform 0.15s ease-out;
}

@keyframes cardEnter {
  0%   { opacity: 0; transform: translateY(24px) scale(0.97); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

// ===================================================================
//  Brand
// ===================================================================
.auth-brand {
  text-align: center;
  margin-bottom: 32px;
}

.brand-icon-wrap {
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
}

.brand-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.2));
}

.brand-title {
  font-size: 26px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.025em;
  margin-bottom: 6px;
}

.brand-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.35);
  font-weight: 400;
}

// ===================================================================
//  页面切换
// ===================================================================
.auth-content {
  :deep(.page-switch-enter-active) {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.2, 1);
  }
  :deep(.page-switch-leave-active) {
    transition: all 0.25s ease;
  }
  :deep(.page-switch-enter-from) {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  :deep(.page-switch-leave-to) {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
}

// ===================================================================
//  Footer
// ===================================================================
.auth-footer {
  text-align: center;
  margin-top: 28px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.2);
  .dot { margin: 0 8px; }
}

// ===================================================================
//  响应式
// ===================================================================
@media (max-width: 480px) {
  .auth-card {
    width: calc(100% - 32px);
    padding: 32px 24px 24px;
    border-radius: 22px;
  }
}
</style>
