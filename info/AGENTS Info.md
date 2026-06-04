# Info

简介: AGENTS.md作为 AI的README文件，一个专门的、可预测的地方，用于提供上下文和说明，以帮助 AI 编码在您的项目中工作，类似于'系统提示词效果'；其中针对大型的项目，在每个模块下放置对应的AGENTS.md文件，方便对应子项目的管理。

注意：常用的AGENTS.md文件，不建议超过200行，内容过长会被截断或者稀释注意力；

# Common matters

AGENTS.md文件下常用指令模块

- 项目概述
- 构建和测试命令
- 代码风格指南
- 测试说明
- 安全考量

# SpringBoot AGENTS.md

````markdown
# 智能客服系统 - 后端服务

SpringBoot 3.x + Mybatis-Plus + Redis + Spring AI RAG 架构的企业级智能客服系统，支持本地知识库挂载与向量检索。

## 技术栈

| 组件         | 版本/说明                     |
| ------------ | ----------------------------- |
| Spring Boot  | 3.2+                          |
| Java         | 17+                           |
| Maven        | 3.8+                          |
| Mybatis-Plus | 3.5.5+                        |
| Redis        | 7.0+（用于会话缓存/向量缓存） |
| Spring AI    | 1.0.0-M3+（RAG核心）          |
| 向量数据库   | PGVector / Milvus（根据配置） |

## 快速命令

```bash
# 编译打包（跳过测试）
mvn clean package -DskipTests

# 运行单元测试
mvn test -Dtest=CustomerServiceTest

# 运行单个测试类
mvn test -Dtest=KnowledgeBaseServiceTest

# 启动应用（dev环境）
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 本地Docker启动依赖（Redis + 向量库）
docker-compose up -d redis pgvector

# 代码格式化（需配置spotless）
mvn spotless:apply

# 检查依赖漏洞
mvn org.owasp:dependency-check-maven:check
```

## 项目结构

```
src/
├── main/java/com/customer/
│   ├── controller/          # REST API层，参数校验+响应封装
│   ├── service/
│   │   ├── rag/             # RAG核心：文档加载/分块/向量化/检索
│   │   ├── session/         # 会话管理（Redis存储）
│   │   └── knowledge/       # 知识库CRUD + 向量同步
│   ├── mapper/              # Mybatis-Plus Mapper
│   ├── config/              # 配置类（Redis/Spring AI/线程池）
│   └── common/              # 统一响应/异常/工具类
├── main/resources/
│   ├── knowledge/           # 挂载的本地知识库目录（不进git）
│   └── db/migration/        # Flyway脚本（如需）
└── test/java/               # 单元测试 + 集成测试
```

## 核心架构约束

### RAG流程规则

- 文档分块：固定512 token，重叠度20%（可通过配置调整）
- 向量化：必须通过Spring AI的`EmbeddingClient`统一接口
- 检索策略：混合检索（向量相似度 + 关键词BM25），默认返回top5
- 上下文拼接：检索结果按相似度降序拼接，拼接前需去重
- **禁止**：将用户问题原文直接拼接进Prompt

### 分层职责

- **Controller**：仅做参数校验、调用Service、返回`Result<T>`
- **Service**：包含业务逻辑，事务边界在Service层
- **Mapper**：只做数据访问，禁止业务逻辑
- **禁止**：Controller直接调用Mapper、Service间循环依赖

### 会话管理规范

- 会话过期时间：30分钟（可配置）
- Redis Key格式：`session:{conversationId}:{userId}`
- 会话上下文只保留最近10轮对话（避免token溢出）
- 敏感信息（密码/token）禁止存入会话

## 代码规范

### 命名约定

| 类型             | 规范                             | 示例                             |
| ---------------- | -------------------------------- | -------------------------------- |
| Controller       | `XxxController`                  | `ChatController`                 |
| Service接口/实现 | `IXxxService` / `XxxServiceImpl` | `IRagService` / `RagServiceImpl` |
| Mapper           | `XxxMapper`                      | `KnowledgeDocMapper`             |
| DTO              | `XxxRequest` / `XxxResponse`     | `ChatRequest`, `RagResponse`     |


### 方法封装决策指南

**目标**：避免过度拆分导致碎片化，同时防止大段重复或过长代码。

#### 强制封装条件（满足其一即可）

| 条件 | 示例 | 原因 |
|------|------|------|
| 相同代码出现 ≥2 次，且每段 ≥3 行 | 两处校验 token 的逻辑各 5 行 | 重复修改风险高 |
| 相同代码出现 ≥3 次（无论行数） | 三处都写 `if (obj == null) return;` | 微小逻辑也应统一 |
| 单段代码行数 ≥10 行（不含空行、注释） | 一个方法内计算折扣的 12 行逻辑 | 过长影响可读性，难以单元测试 |
| 代码代表独立概念 | `calculateTax()`、`sendNotification()` | 单一职责，便于复用和命名 |

#### 允许内联的情况

- 代码行数 ≤2 行，且全项目出现 ≤2 次
- 简单属性访问（如 `return name`）
- 调试或临时性代码（需加 `// TODO: refactor if repeats`）

#### 判定流程

1. 写代码时先内联。
2. 提交前检查：
   - 是否重复？→ 按上表判断。
   - 是否超过 10 行？→ 抽取。
   - 是否表达独立概念？→ 抽取。
3. 不确定时：**抽出来**（方法短小永远优于长方法）。

### 强制规则

- 所有public方法必须有Javadoc
- 使用Lombok（`@Data`、`@Builder`、`@Slf4j`）
- 禁止使用`System.out.println()`
- 所有外部调用（HTTP/DB/Redis）必须有超时配置
- 异常处理：业务异常使用`BusinessException`，未知异常全局兜底


#### ✅ 正确示例

```java
@RestController
@Slf4j
public class ChatController {
    @PostMapping("/chat")
    public Result<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        return Result.success(chatService.process(request));
    }
}
```

#### ❌ 错误示例（Controller直接操作Mapper）

## 测试规范

### 单元测试

- 使用JUnit 5 + Mockito
- 命名：`XxxServiceTest`，方法名表达场景
- 覆盖率目标：核心RAG模块 > 80%

## 集成测试

- 使用`@SpringBootTest` + `@TestContainers`
- 必须启动真实Redis/向量库容器
- 测试数据使用`@Sql`脚本初始化，结束后自动清理

```bash
# 运行集成测试
mvn verify -Pintegration-test
```

## 安全考量

### 必须遵守

- **API认证**：除`/health`、`/v3/api-docs`外，全部需要JWT Token
- **敏感数据**：数据库密码/AI密钥使用Jasypt加密，禁止明文
- **输入校验**：使用`@Valid` + 自定义Validator，防Prompt注入
- **日志脱敏**：日志中禁止打印用户问题原文，只打印长度和hash

### 知识库安全

- 上传文件限制：最大10MB，仅限PDF/Markdown/TXT
- 文件内容扫描：禁止包含可执行代码（JS/Shell）
- 本地知识库目录权限：只读（`chmod 750`）

### 依赖安全

```bash
# 每周执行漏洞检查
mvn org.owasp:dependency-check-maven:check \
  -DfailOnError=false \
  -Dformat=HTML \
  -DoutputDirectory=target/security-reports
```

## 配置管理

```yaml
# application-dev.yml 示例（不进git）
spring:
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}  # 环境变量注入
  redis:
    password: ${REDIS_PASSWORD:}

# 知识库配置
knowledge:
  local-path: ./knowledge-base
  chunk-size: 512
  overlap: 102
  top-k: 5
```

- **禁止**：任何包含敏感信息的配置文件提交到Git
- **必须**：所有环境差异配置使用`spring.profiles.active`分离

## 性能指标（SLA）

| 指标             | 目标值  | 监控方式   |
| ---------------- | ------- | ---------- |
| 单次RAG检索      | < 500ms | Micrometer |
| 会话Redis读取    | < 10ms  | 慢日志     |
| 并发吞吐         | 100 QPS | JMeter压测 |
| 向量检索(5w文档) | < 200ms | 自定义埋点 |

## 禁止事项

- ❌ 在Controller中写业务逻辑
- ❌ 直接拼接LLM Prompt（必须通过`PromptTemplate`）
- ❌ 同步调用中嵌套异步（`CompletableFuture`需异常处理）
- ❌ 大对象（>1MB）存入Redis
- ❌ 硬编码任何URL/密钥/路径
- ❌ 忽略RAG检索失败的Fallback逻辑（必须配置降级回答）

## 重要提醒

1. **本地知识库变更后**：必须触发对应的向量库同步（增量更新或全量重建）
2. **Redis缓存预热**：系统启动时需预热常用知识库元数据
3. **AI Token消耗**：设置每日/每用户上限，防止滥用
4. **生产环境**：强制启用HTTPS + 请求限流（Guava RateLimiter或Sentinel）
````

# Vue  AGENTS.md

````markdown
# 智能客服系统 - 前端服务（Vue3版本）

Vue 3 + TypeScript + Vite + Pinia + Element Plus 构建的企业级智能客服前端，支持实时会话、知识库管理、RAG检索可视化。

## 技术栈

| 组件 | 版本/说明 |
|------|----------|
| Vue | 3.4+ (Composition API) |
| TypeScript | 5.0+ |
| Vite | 5.0+（构建工具） |
| Element Plus | 2.6+（UI组件库） |
| Pinia | 2.1+（状态管理） |
| Vue Router | 4.2+（路由） |
| Axios | 1.6+（HTTP客户端） |
| ESLint | 8.56+（代码检查） |
| Prettier | 3.2+（代码格式化） |
| Vitest + Vue Test Utils | 1.0+（单元测试） |

## 快速命令

```bash
# 安装依赖
npm install

# 启动开发服务器（默认端口 5173）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 运行单元测试
npm run test

# 运行测试（监听模式）
npm run test:watch

# 代码检查
npm run lint

# 自动修复代码风格问题
npm run lint:fix

# 格式化代码
npm run format

# 类型检查
npm run type-check
```

## 项目结构

```
src/
├── api/                      # API请求封装
│   ├── client.ts            # axios实例配置（拦截器、超时）
│   ├── chat.ts              # 聊天相关接口
│   ├── knowledge.ts         # 知识库CRUD接口
│   └── auth.ts              # 登录/认证接口
├── assets/                  # 静态资源（图片、字体等）
├── components/              # 公共组件
│   ├── ChatWindow/          # 聊天窗口组件
│   ├── MessageItem/         # 单条消息组件（含引用来源）
│   ├── KnowledgeEditor/     # 知识库编辑器
│   └── Layout/              # 布局组件（侧边栏、头部）
├── composables/              # 组合式函数（替代hooks）
│   ├── useChatSession.ts    # 会话管理（连接Redis后端）
│   ├── useStreamingChat.ts  # 流式响应处理
│   └── useDebounce.ts       # 防抖（搜索输入）
├── layouts/                 # 页面布局
│   ├── MainLayout.vue       # 主布局（含菜单）
│   └── BlankLayout.vue      # 空白布局（登录页）
├── pages/                   # 页面组件
│   ├── Chat/                # 智能客服对话页
│   ├── KnowledgeBase/       # 知识库管理页（列表/上传/同步）
│   ├── Login/               # 登录页
│   └── Dashboard/           # 仪表盘（统计信息）
├── stores/                  # Pinia状态管理
│   ├── auth.ts              # 认证状态（token、用户信息）
│   ├── chat.ts              # 聊天状态（当前会话ID、消息列表）
│   └── knowledge.ts         # 知识库缓存（文档列表）
├── types/                   # TypeScript类型定义
│   ├── api.ts               # 接口请求/响应类型
│   ├── chat.ts              # 消息、会话类型
│   └── knowledge.ts         # 知识库文档类型
├── utils/                   # 工具函数
│   ├── request.ts           # 请求辅助函数
│   ├── storage.ts           # 本地存储封装（token）
│   ├── xss.ts               # XSS过滤（DOMPurify）
│   └── formatter.ts         # 时间/文本格式化
├── router/                  # 路由配置
│   └── index.ts
├── App.vue                  # 根组件
├── main.ts                  # 入口文件
└── vite-env.d.ts            # Vite环境变量类型
```

## 核心架构约束

### 状态管理规范

- **Pinia Store划分**：按业务领域拆分（auth、chat、knowledge），禁止单一大Store
- **会话状态**：`chat` store维护当前会话ID、消息列表、加载状态，与会话过期时间（30分钟）同步后端
- **Token持久化**：使用`localStorage`存储JWT Token，需配合CSP防XSS；登录成功写入，登出/401时清除
- **禁止**：在组件内直接修改Store（必须通过actions）

### 组件设计规范

- **Composition API优先**：所有组件使用`<script setup lang="ts">`语法
- **组件拆分粒度**：单一职责，单个Vue文件不超过300行（不含样式）
- **Props/Emits类型定义**：必须使用`defineProps<T>()`和`defineEmits<T>()`，禁用运行时声明
- **样式作用域**：使用`<style scoped>`或CSS Modules，避免全局污染

```vue
<!-- ✅ 正确示例 -->
<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  message: string
  isOwn: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'reply', content: string): void
}>()
</script>

<template>
  <div :class="{ 'message-own': isOwn }">{{ message }}</div>
</template>

<style scoped>
.message-own { text-align: right; }
</style>
```

```vue
<!-- ❌ 错误示例：使用Options API、无类型 -->
<script>
export default {
  props: ['message', 'isOwn']
}
</script>
```

### 路由规范

- **路由模式**：`createWebHistory`（HTML5模式，需后端配置404回退）
- **权限控制**：使用路由守卫（`router.beforeEach`），检查token和角色
- **懒加载**：所有页面组件使用动态导入（`() => import('@/pages/...')`）
- **布局嵌套**：`MainLayout`用于需要侧边栏的页面（聊天、知识库），`BlankLayout`用于登录页

### 组合式函数规范

- **命名**：`use`前缀 + 驼峰（如`useChatSession`）
- **职责**：封装可复用的响应式逻辑和副作用清理
- **返回**：返回`ref`/`reactive`状态和方法，使用`readonly`暴露不可变状态

```typescript
// composables/useDebounce.ts
import { ref, watch } from 'vue'

export function useDebounce<T>(value: T, delay: number) {
  const debouncedValue = ref(value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>
  
  watch(value, (newVal) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = newVal
    }, delay)
  })
  
  return { debouncedValue }
}
```

## HTTP请求规范

### 统一配置

```typescript
// api/client.ts
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30秒超时
})

// 请求拦截器：添加Token
client.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// 响应拦截器：统一错误处理
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

### 强制要求

- 所有API调用必须在`api/`目录下按模块组织，禁止在组件内直接调用axios
- 使用TypeScript定义请求参数和响应数据类型
- 上传文件等长时间操作需配置`timeout`为120秒，并显示加载进度

## 页面交互规范

### 聊天页面（Chat）

- **流式响应**：使用`fetch` + `ReadableStream`处理SSE，边接收边渲染Markdown
- **引用来源**：消息底部展示RAG检索到的文档片段（文档名+相似度），支持点击查看原文
- **会话列表**：左侧边栏展示最近10条会话（从后端获取），支持切换和删除
- **输入框**：支持Enter发送（可配置Shift+Enter换行），限制最大长度2000字符

### 知识库管理（KnowledgeBase）

- **文档列表**：表格展示文档名、大小、上传时间、向量化状态，支持搜索和分页
- **上传组件**：拖拽上传，限制10MB，支持PDF/Markdown/TXT，显示上传进度
- **同步按钮**：手动触发增量同步到向量库，同步过程中按钮禁用并显示loading
- **预览功能**：点击文档行可查看原始内容（纯文本预览，不执行任何脚本）

## 代码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue组件文件 | PascalCase | `ChatWindow.vue` |
| 组合式函数 | camelCase + `use`前缀 | `useChatSession.ts` |
| Store文件 | camelCase + 业务名 | `auth.ts` |
| 工具函数文件 | camelCase | `formatter.ts` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |

### 强制规则

- 所有`<script setup>`必须明确定义`defineProps`和`defineEmits`的类型
- 使用ESLint + Prettier统一代码风格，禁止`console.log`（除`vite-env.d.ts`）
- 异步操作必须处理错误（try/catch或`.catch()`），避免未捕获的Promise reject
- 使用`v-html`时需先通过DOMPurify过滤XSS（仅用于可信Markdown渲染）
- 组件卸载时清理定时器、事件监听器（`onUnmounted`）

## 测试规范

### 单元测试

- 使用Vitest + Vue Test Utils
- 测试文件命名：`*.spec.ts`，与源文件同目录或放在`__tests__`目录
- 测试范围：组合式函数、Store actions、工具函数、复杂组件
- 覆盖率目标：核心模块（chat、knowledge）> 70%

```typescript
// composables/__tests__/useDebounce.spec.ts
import { describe, expect, vi } from 'vitest'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const { debouncedValue } = useDebounce(ref('a'), 100)
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(debouncedValue.value).toBe('a')
  })
})
```

### 组件测试

```typescript
import { mount } from '@vue/test-utils'
import MessageItem from '@/components/MessageItem.vue'

test('renders own message with right alignment', () => {
  const wrapper = mount(MessageItem, {
    props: { message: 'Hello', isOwn: true }
  })
  expect(wrapper.classes()).toContain('message-own')
})
```

## 安全考量

### 必须遵守

- **输入校验**：使用Element Plus表单校验，前端做基础格式校验（邮箱、长度等）
- **XSS防护**：渲染Markdown时使用DOMPurify清洗（`v-html`前调用）
- **Token安全**：仅存储在`localStorage`，配合CSP策略禁止内联脚本
- **敏感数据**：用户密码在前端必须使用MD5? 不，应使用HTTPS传输，前端不做加密
- **环境变量**：`VITE_API_BASE_URL`、`VITE_APP_TITLE`等必须以`VITE_`开头，禁止硬编码

### 依赖安全

```bash
# 每周执行漏洞检查
npm audit
# 或使用 snyk
snyk test
```

## 配置管理

```typescript
// .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=智能客服系统(开发)

// .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=智能客服系统
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': '/src' } },
  server: { port: 5173, proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } } }
})
```

- **禁止**：将`.env`文件提交到Git（仅提交`.env.example`）
- **必须**：所有API地址使用相对路径或环境变量，支持反向代理

## 性能指标（SLA）

| 指标 | 目标值 | 监控方式 |
|------|--------|----------|
| 首屏加载时间（LCP） | < 2.5s | Lighthouse / Web Vitals |
| 聊天消息渲染延迟 | < 100ms | Performance API |
| 页面切换（路由） | < 300ms | 用户反馈 |
| 内存占用（长时间对话） | < 150MB | Chrome DevTools |
| 构建体积（gzip后） | < 500KB（不含chunk） | rollup-plugin-visualizer |

## 禁止事项

- ❌ 在组件中直接调用API（必须通过`api/`模块）
- ❌ 使用`any`类型（必须定义明确接口或使用`unknown`）
- ❌ 忽略异步错误（必须catch并友好提示）
- ❌ 在模板中写复杂逻辑（应使用计算属性或方法）
- ❌ 硬编码路由路径（使用命名路由`router.push({ name: 'Login' })`）
- ❌ 直接操作DOM（Vue3推荐通过ref和响应式数据）
- ❌ 生产环境保留`console.log`

## 重要提醒

1. **后端API对接**：遵循后端Swagger文档，类型定义从后端DTO生成（可用`openapi-typescript`）
2. **会话同步**：前端会话过期时间（30分钟）需与后端Redis TTL一致，到期后自动跳转或提示刷新
3. **流式响应兼容性**：SSE方案需fallback（EventSource不支持时使用fetch轮询）
4. **移动端适配**：聊天窗口需响应式，支持手机横屏和触屏操作（使用`@vueuse/core`检测）
5. **国际化**：预留i18n结构（当前仅中文，后续扩展）
````





