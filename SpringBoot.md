# AGENTS.md

Spring Boot 4.0.6 + Spring AI 2.0.0-M8 + MyBatis-Plus + JPA 架构的企业级 AI 后端服务，支持 Chat / Streaming 与可扩展的 RAG 能力。

## 技术栈

| 组件 | 版本 |
|------|------|
| Spring Boot | 4.0.6 |
| Java | 21 |
| Spring AI | 2.0.0-M8 (OpenAI) |
| MyBatis-Plus | 3.5.16 |
| JPA / Hibernate | Boot 4.x 管理 |
| 数据库 | H2 (dev) / PostgreSQL (prod) |

## 快速命令

```bash
# 编译打包
mvn clean package -DskipTests

# 运行单元测试
mvn test

# 运行单个测试类
mvn test -Dtest=ChatServiceTest

# 启动应用（dev 环境）
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 生产构建
mvn clean package -DskipTests -Pprod
```

## 项目结构

```
src/main/java/com/ai/project/
├── aspect/          # LoggingAspect — Service/Controller 切面日志
├── common/          # Result<T> 统一响应封装
├── config/          # SpringAi, Async, MyBatis-Plus, WebMvc 配置
├── constant/        # Constants 集中管理常量
├── controller/      # REST API — 仅参数校验 + 调用 Service
├── dto/             # ChatRequest / ChatResponse 输入输出 DTO
├── entity/          # BaseEntity + 数据表映射实体 (JPA + MP)
├── exception/       # BusinessException + GlobalExceptionHandler
├── mapper/          # MyBatis-Plus Mapper 接口
└── service/
    ├── impl/        # ChatServiceImpl 等实现类
    └── *Service.java # 接口定义契约
```

## 核心架构约束

### 分层职责

- **Controller**：仅参数校验（`@Valid`）、调用 Service、返回 `Result<T>`。禁止业务逻辑。
- **Service**：接口+实现分离，事务边界在 `@Service` 实现层，使用 `@Transactional(rollbackFor = Exception.class)`。
- **Mapper / Repository**：只做数据访问，禁止业务逻辑。
- **注入方式**：强制**构造器注入**（final field + constructor），禁止 `@Autowired` 字段注入。

### Spring AI 规范

- `ChatClient` 统一通过 `SpringAiConfig` 注册为 Bean，配置外置到 `application.yml`。
- AI 调用必须配置超时（`spring.ai.openai.chat.options.max-tokens`）与重试（`RetryTemplate`，指数退避，最大 3 次）。
- 记录每次调用的 prompt/completion token，便于成本追踪。
- Prompt 模板存放在 `resources/prompts/`，通过 `Resource` 加载，禁止字符串拼接。

### 异常处理

优先级：`MethodArgumentNotValidException` → `ConstraintViolationException` → `BusinessException` → `Exception` 兜底。全部通过 `@RestControllerAdvice` 统一返回 `Result<T>`，业务异常使用 `BusinessException`。

## 代码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| Controller | `XxxController` | `ChatController` |
| Service 接口/实现 | `XxxService` / `XxxServiceImpl` | `ChatService` / `ChatServiceImpl` |
| Mapper | `XxxMapper` | `AiChatLogMapper` |
| DTO | `XxxRequest` / `XxxResponse` | `ChatRequest` / `ChatResponse` |
| 配置类 | `XxxConfig` | `SpringAiConfig` |

### 强制规则

- 所有 public 方法必须有 Javadoc（类 + 方法 + 参数 + 返回值）。
- 使用 Lombok（`@Data`、`@Builder`、`@Slf4j`），禁止 `System.out.println()`。
- 日志使用 Slf4j 占位符（`log.info("用户 {}", id)`），禁止字符串拼接；禁止输出敏感信息。
- 常量集中管理（`Constants.java`），禁止硬编码。
- 敏感信息（API Key、数据库密码）使用环境变量注入，禁止提交到 Git。

### 方法封装决策

- 相同代码 ≥2 次且每段 ≥3 行 → 抽取；单方法 ≥10 行 → 抽取；独立概念 → 抽取。
- 不确定时优先抽取（短方法优于长方法）。

## 测试规范

- **单元测试**：JUnit 5 + Mockito，命名 `XxxServiceTest` / `XxxTest`，方法名表达场景（`should_ReturnXxx_When_Yyy`）。
- **切片测试**：`@WebMvcTest`（Controller）/ `@DataJpaTest`（Repository）。
- **集成测试**：`@SpringBootTest` + Testcontainers。
- 核心模块覆盖率目标 > 80%。

## 配置管理

```yaml
# application-dev.yml（不进 Git）
spring:
  ai:
    openai:
      api-key: ${AI_OPENAI_API_KEY}
  datasource:
    url: jdbc:h2:mem:ai_project
```

- 多环境：`dev` / `test` / `prod`，通过 `spring.profiles.active` 激活。
- 配置属性使用 `@ConfigurationProperties` 绑定，避免散落的 `@Value`。

## 安全考量

- 输入校验：`@Valid` + Bean Validation（`@NotBlank`、`@Size`），防止注入。
- 防全表操作：MyBatis-Plus 配置 `BlockAttackInnerInterceptor`。
- 日志脱敏：日志中禁止打印敏感信息，如有需要 `*` 替换。
- 依赖安全：定期 `mvn versions:display-dependency-updates` 检查更新。

## 禁止事项

- ❌ Controller 中写业务逻辑或直接调用 Mapper
- ❌ Service 间循环依赖
- ❌ `@Autowired` 字段注入
- ❌ AI Prompt 字符串拼接（必须通过 `PromptTemplate` / System Prompt 文件）
- ❌ 硬编码 URL / API Key / 路径
- ❌ 忽略异步错误（CompletableFuture / Flux 必须处理异常）
- ❌ 大对象（> 1MB）存入 Redis / Session
- ❌ 生产日志保留 `System.out` 或未脱敏的敏感数据

## 重要提醒

1. **AI 调用**：设置每日/每用户 token 上限，防止滥用。
2. **数据库**：生产环境使用 PostgreSQL，JPA `ddl-auto` 设为 `validate`（禁止自动建表）。
3. **异步任务**：耗时操作（AI 流式、文件处理）使用 `@Async("aiTaskExecutor")`。
4. **CORS**：开发阶段在 `WebMvcConfig` 中配置前端地址，禁止生产环境开放所有来源。
