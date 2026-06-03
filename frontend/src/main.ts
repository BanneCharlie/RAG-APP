/**
 * 应用入口文件
 * 对应后端的 @SpringBootApplication（main 方法）
 *
 * 初始化顺序：
 * 1. 导入全局样式（对应后端全局配置）
 * 2. 创建 Vue 应用实例
 * 3. 注册 Pinia 状态管理（对应后端 Spring IoC 容器）
 * 4. 注册 Vue Router（对应后端 Controller 映射）
 * 5. 挂载到 DOM
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'

// 导入全局样式（对应后端的 WebMvcConfigurer 全局配置）
import '@/styles/index.scss'

function bootstrap(): void {
  const app = createApp(App)

  // 注册 Pinia（对应 Spring IoC 容器，管理全局状态）
  app.use(createPinia())

  // 注册 Vue Router（对应 Spring MVC 的 DispatcherServlet）
  app.use(router)

  // 挂载应用（对应 Spring Boot 内嵌 Tomcat 启动）
  app.mount('#app')
}

bootstrap()
