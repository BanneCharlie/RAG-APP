<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">403</h1>
      <h2 class="error-title">无权限访问</h2>
      <p class="error-description">抱歉，您没有权限访问此页面。请联系管理员获取访问权限。</p>
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
  color: $warning-color;
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
