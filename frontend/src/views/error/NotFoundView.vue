<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面不存在</h2>
      <p class="error-description">抱歉，您访问的页面不存在或已被移除。</p>
      <router-link to="/dashboard" class="back-home">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  @include flex-center;
  min-height: 60vh;
}

.error-content {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: $primary-color;
  line-height: 1;
  margin-bottom: $spacing-md;
  opacity: 0.8;
}

.error-title {
  font-size: $font-size-xl;
  color: $text-primary;
  margin-bottom: $spacing-base;
}

.error-description {
  color: $text-secondary;
  margin-bottom: $spacing-xl;
}

.back-home {
  display: inline-block;
  padding: 10px 24px;
  background: $primary-color;
  color: #fff;
  border-radius: $radius-base;
  text-decoration: none;

  &:hover {
    background: color.adjust($primary-color, $lightness: -8%);
  }
}
</style>
