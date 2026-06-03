# AGENTS.md

Vue 3 + TypeScript 6 + Vite 8 + Pinia 3 + Axios 构建的企业级后台管理系统，支持认证鉴权、用户管理、仪表盘。

## 技术栈

| 组件        | 版本                                     |
| ----------- | ---------------------------------------- |
| Vue         | 3.5+ (Composition API, `<script setup>`) |
| TypeScript  | 6.0+                                     |
| Vite        | 8.0+（构建工具）                         |
| Pinia       | 3.0+（状态管理）                         |
| Vue Router  | 4.6+（路由）                             |
| Axios       | 1.16+（HTTP 客户端）                     |
| SCSS / Sass | 1.100+（样式预处理）                     |

## 快速命令

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 5173，代理 /api → localhost:8080）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── api/                     # API 请求层（对应后端 Controller）
│   ├── http/               # Axios 实例 + 请求/响应拦截器
│   ├── modules/            # 按模块拆分（auth、user）
│   └── index.ts            # 统一导出入口
├── assets/                 # 静态资源
├── config/                 # 应用配置（app.ts + constant.ts）
├── composables/            # 组合式函数
│   ├── useAuth.ts          # 登录/注册/登出交互逻辑
│   ├── usePagination.ts    # 分页查询封装
│   └── useRequest.ts       # 通用异步请求（loading/error/data）
├── layouts/                # 布局组件
│   ├── AuthLayout.vue      # 认证页布局（Sonoma 风格视差背景）
│   └── DefaultLayout.vue   # 主布局（侧边栏 + 顶栏 + 内容区）
├── router/
│   ├── guards/             # 路由守卫（authGuard + permissionGuard）
│   └── index.ts            # 路由表（懒加载、嵌套路由）
├── stores/                 # Pinia 状态管理
│   ├── auth.ts             # 认证状态（Token、用户、权限、角色）
│   ├── app.ts              # 全局状态（侧边栏、主题、加载、标题）
│   └── index.ts            # 统一导出
├── styles/                 # SCSS 全局样式
│   ├── variables.scss      # 主题色/文字/间距/阴影变量
│   ├── mixins.scss         # 混入（card、transition）
│   └── index.scss          # 入口（reset + 全局样式）
├── types/                  # TypeScript 类型定义
│   ├── api.ts              # ApiResult、PageResult、枚举
│   ├── dto/                # DTO（login.dto、user.dto）
│   ├── models/             # 数据模型（auth、user）
│   └── index.ts
├── utils/                  # 工具函数
│   ├── storage.ts          # localStorage/sessionStorage 封装
│   ├── validate.ts         # 校验（手机/邮箱/密码/URL）
│   ├── error-handler.ts    # 全局错误解析 + 友好提示
│   ├── format.ts           # 格式化
│   └── index.ts
├── views/                  # 页面组件
│   ├── auth/               # LoginView、RegisterView
│   ├── dashboard/          # DashboardView
│   ├── user/               # UserListView、UserDetailView
│   └── error/              # ForbiddenView、NotFoundView
├── App.vue                 # 根组件
└── main.ts                 # 入口文件（Pinia → Router → mount）
```

## 核心架构约束

### 分层职责（对应后端架构映射）

| 前端层                | 对应后端              | 职责                                      |
| --------------------- | --------------------- | ----------------------------------------- |
| `api/modules/`        | Controller            | 定义接口调用，路径 + 方法 + 参数类型      |
| `stores/`             | Service               | 状态管理 + 业务逻辑（login/logout/fetch） |
| `composables/`        | AOP / Util            | 可复用逻辑封装（分页、请求状态）          |
| `router/guards/`      | Security 拦截器       | 认证检查 + 权限校验                       |
| `utils/error-handler` | @RestControllerAdvice | 统一错误解析 + 用户友好提示               |

### 状态管理规范

- **Pinia Store 按业务领域拆分**（auth、app），禁止单一大 Store。
- **Token 持久化**：使用 `localStorageUtil` 读写（带 `rag_app_` 前缀），登录成功写入，登出/401 时清除。
- **Store 内禁止直接操作 DOM**，通过 actions 修改 state。
- 组件内通过 `storeToRefs` 或 computed 读取状态，禁止直接修改 store state。

### HTTP 请求规范

- 统一通过 `api/modules/` 下的函数调用，禁止组件内直接调用 axios。
- 请求拦截器自动附带 `Bearer Token`，响应拦截器统一解析业务码。
- 401 → 清除 Token 跳转登录页；业务异常码 → 映射为友好提示。
- TypeScript 定义完整的请求参数和响应数据类型。

### 路由规范

- **路由模式**：`createWebHistory`（HTML5 模式）。
- **认证守卫**：白名单（`/auth/login`、`/auth/register`、`/error/*`）放行，其余需登录。
- **权限守卫**：根据路由 `meta.roles` 校验用户角色，无权限跳转 403。
- **懒加载**：所有页面组件使用 `() => import('@/views/...')` 动态导入。
- **布局嵌套**：`DefaultLayout` 用于需侧边栏页面，`AuthLayout` 用于登录/注册。

### 组合式函数规范

- **命名**：`use` + 驼峰（如 `useAuth`、`usePagination`）。
- **职责**：封装可复用的响应式逻辑，返回 `ref` 状态和方法。
- **副作用清理**：组件卸载时清理定时器/事件监听（`onBeforeUnmount`）。

## 代码规范

### 命名约定

| 类型            | 规范                          | 示例                           |
| --------------- | ----------------------------- | ------------------------------ |
| Vue 组件        | PascalCase                    | `UserListView.vue`             |
| 组合式函数      | camelCase + `use`             | `usePagination.ts`             |
| Store           | camelCase                     | `auth.ts`                      |
| API 模块        | camelCase                     | `auth.ts`、`user.ts`           |
| 工具函数        | camelCase                     | `storage.ts`、`validate.ts`    |
| 常量/枚举       | UPPER_SNAKE_CASE / PascalCase | `STORAGE_KEYS`、`BusinessCode` |
| TypeScript 接口 | PascalCase + 后缀             | `LoginDto`、`UserListItem`     |

### 强制规则

- 所有 `<script setup>` 必须明确定义 `defineProps<T>()` 和 `defineEmits<T>()` 类型。
- 异步操作必须处理错误（try/catch 或 .catch()）。
- 使用 `import.meta.env.DEV` 控制开发日志，生产环境禁止 `console.log`。
- 样式使用 `<style scoped lang="scss">`，通过 `$variables` 引用设计令牌。
- 禁止硬编码路由路径（使用 `name` 路由跳转）。

## 安全考量

- **Token 安全**：存储在 localStorage，配合请求拦截器自动携带，不暴露到 URL。
- **XSS 防护**：避免 `v-html` 直接渲染用户输入；如必须使用，先经 DOMPurify 清洗。
- **输入校验**：前端预校验（`validate.ts`）+ 后端 `@Valid` 双重保障。
- **环境变量**：所有配置以 `VITE_` 开头，通过 `appConfig` 读取，禁止硬编码。
- **错误脱敏**：错误提示不暴露具体堆栈，使用 `parseAxiosError` 映射为用户友好消息。

## 配置管理

```typescript
// .env.development
VITE_API_BASE_URL=/api/v1
VITE_APP_NAME=RAG APP
```

- **禁止**：将 `.env` 文件提交到 Git（仅提交 `.env.example`）。
- **必须**：所有 API 地址使用环境变量，Vite 配置反向代理到后端。

## 禁止事项

- ❌ 组件内直接调用 axios（必须通过 `api/modules/`）
- ❌ 使用 `any` 类型（必须定义接口或使用 `unknown`）
- ❌ 忽略异步错误（必须处理并友好提示）
- ❌ 模板中写复杂表达式（应使用计算属性或方法）
- ❌ 硬编码路由路径（使用 `name`）
- ❌ 直接操作 DOM（通过 `ref` + 响应式数据）
- ❌ 生产环境保留 `console.log`
- ❌ 大型组件（单个 `.vue` 文件超过 300 行）
- ❌ 在没有 `scoped` 的情况下编写全局样式

## 重要提醒

1. **后端 API 对接**：类型定义（DTO）需与后端保持同步，推荐用 `openapi-typescript` 生成。
2. **Token 过期处理**：响应拦截器检测 401 后自动跳转登录，保留 `redirect` 参数回跳。
3. **分页约定**：页数从 0 开始（`defaultPage: 0`），与后端约定一致。
4. **主题变量**：通过 `data-theme` 属性切换，所有颜色在 `variables.scss` 中集中定义。
5. **构建优化**：生产构建使用 `vite build`，注意 gzip 和 chunk 分割策略。