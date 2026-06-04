package com.ai.project.config;

import com.ai.project.constant.Constants;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.support.RetryTemplate;

import java.time.Duration;

/**
 * Spring AI 配置
 * <p>
 * 创建 {@link ChatClient} Bean 并配置 AI 调用的重试机制。
 * 所有 AI 相关设置外置到 {@code application.yml} 的 {@code spring.ai} 下。
 */
@Configuration
@EnableRetry
public class SpringAiConfig {

    /**
     * 默认聊天客户端，由 Spring AI Starter 自动配置的 {@link ChatClient.Builder} 构建
     * <p>
     * temperature、max-tokens 等默认值通过 application.yml 的
     * {@code spring.ai.openai.chat.options.*} 配置。
     * 当 {@code spring.ai.openai.enabled=false} 时禁用。
     */
    @Bean
    @ConditionalOnProperty(prefix = "spring.ai.openai", name = "enabled", havingValue = "true", matchIfMissing = true)
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem(Constants.SYSTEM_PROMPT_PATH)
                .build();
    }

    /**
     * AI 调用重试模板，使用指数退避策略
     * <p>
     * 对所有异常进行重试，但非临时性 AI 错误（如无效 API Key）除外，
     * 这类错误会直接向上抛出。
     */
    @Bean
    public RetryTemplate aiRetryTemplate() {
        return RetryTemplate.builder()
                .maxAttempts(3)
                .exponentialBackoff(Duration.ofSeconds(1), 2, Duration.ofSeconds(10))
                .notRetryOn(NonTransientAiException.class)
                .build();
    }
}
