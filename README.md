# 🚀 RAG AI Project

[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Java Version](https://img.shields.io/badge/Java-21%2B-blue.svg)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.14-green.svg)](https://spring.io/projects/spring-boot)
[![Vue](https://img.shields.io/badge/Vue-3.5%2B-4FC08D.svg)](https://vuejs.org/)
[![Stage](https://img.shields.io/badge/Status-Developing-orange.svg)]()

> **RAG AI Project** — 基于 Spring Boot 4 + Spring AI 2 + Vue 3 + Vite 8 的前后端分离企业级 AI 应用框架，提供智能对话、认证鉴权与后台管理能力。

---

## 📦 技术栈

| 层次 | 技术 | 版本 |
|------|------|------|
| **后端** | Spring Boot / Spring AI | 3.5.14 / 1.1.7 |
| **后端** | Java | 21 |
| **后端** | MyBatis-Plus / JPA | 3.5.16 / Boot 4.x |
| **后端** | 数据库 | H2 (dev) / PostgreSQL (prod) |
| **前端** | Vue / Vite / TypeScript | 3.5+ / 8.0+ / 6.0+ |
| **前端** | Pinia / Vue Router | 3.0+ / 4.6+ |
| **前端** | Axios / SCSS | 1.16+ / 1.100+ |

---

## 🏗️ 项目结构

```
RAG-AI-Project/
├── backend/                     # Spring Boot 后端服务
│   └── src/main/java/com/ai/project/
│       ├── aspect/              # LoggingAspect 切面日志
│       ├── common/              # Result<T> 统一响应
│       ├── config/              # SpringAi/Async/MyBatis-Plus 配置
│       ├── constant/            # 常量管理
│       ├── controller/          # REST API（Chat / Health）
│       ├── dto/                 # ChatRequest / ChatResponse
│       ├── entity/              # BaseEntity + 实体
│       ├── exception/           # BusinessException + 全局异常处理
│       ├── mapper/              # MyBatis-Plus Mapper
│       └── service/             # ChatService 接口 + 实现
├── frontend/                    # Vue 3 前端管理界面
│   └── src/
│       ├── api/                 # Axios HTTP 层
│       ├── composables/         # useAuth / usePagination / useRequest
│       ├── layouts/             # AuthLayout / DefaultLayout
│       ├── router/guards/       # 认证守卫 + 权限守卫
│       ├── stores/              # auth / app 状态管理
│       ├── styles/              # SCSS 变量 + 全局样式
│       ├── types/               # TypeScript 类型定义
│       ├── utils/               # storage / validate / error-handler
│       └── views/               # 登录 / 用户管理 / 仪表盘
├── SpringBoot.md                # 后端 AGENTS 指南
└── Vue.md                       # 前端 AGENTS 指南
```

---

## 🚀 快速开始

### 后端

```bash
# 进入后端目录
cd backend

# 编译打包
mvn clean package -DskipTests

# 启动（dev 环境，默认 H2 内存库）
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

后端启动后默认监听 `http://localhost:8080`，API 路径 `/api/v1/*`。

### 前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器（代理 API 到 localhost:8080）
npm run dev
```

前端启动后默认访问 `http://localhost:5173`。

---

## 🌟 核心特性

*   **🤖 AI 智能对话**：基于 Spring AI 2.0 + OpenAI，支持同步/流式（SSE）两种交互模式
*   **🔐 认证鉴权体系**：JWT Token 认证 + 角色/权限路由守卫
*   **📋 用户管理**：CRUD、分页查询、状态切换、批量操作
*   **📊 仪表盘**：全局统计概览
*   **🎨 Apple Sonoma 风格**：认证页玻璃视差特效，响应式布局
*   **🌗 主题切换**：亮色/暗色主题一键切换
*   **🔄 优雅的错误处理**：前端统一错误拦截 + 友好提示，业务码/HTTP 状态码分级映射

---

## 🔧 AI 智能体配置

本项目包含两份 AGENTS.md 文档，供 AI 编码助手获取项目上下文：

| 文件 | 内容 |
|------|------|
| [SpringBoot.md](SpringBoot.md) | 后端架构约束、代码规范、Spring AI 约定、测试/安全规范 |
| [Vue.md](Vue.md) | 前端分层映射、组合式函数规范、路由守卫、HTTP 拦截器约定 |

---

## 📜 开发规范要点

- **后端**：构造器注入、接口/实现分离、`@RestControllerAdvice` 全局异常、Slf4j 占位符日志
- **前端**：Composition API + `<script setup>`、lint 校验、TypeScript 类型严格、SCSS 变量化
- **通用**：敏感信息环境变量注入、禁止硬编码、异常必须有兜底处理

---

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源。
