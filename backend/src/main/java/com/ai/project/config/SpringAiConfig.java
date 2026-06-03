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
 * Spring AI configuration.
 * <p>
 * Creates the {@link ChatClient} bean and configures retry handling
 * for AI service calls. All AI-related settings are externalized to
 * {@code application.yml} under the {@code spring.ai} prefix.
 */
@Configuration
@EnableRetry
public class SpringAiConfig {

    /**
     * Default chat client constructed from the auto-configured
     * {@link ChatClient.Builder} provided by the Spring AI starter.
     * <p>
     * Defaults like temperature and max-tokens are configured via
     * {@code spring.ai.openai.chat.options.*} in application.yml.
     * Disabled if {@code spring.ai.openai.enabled=false}.
     */
    @Bean
    @ConditionalOnProperty(prefix = "spring.ai.openai", name = "enabled", havingValue = "true", matchIfMissing = true)
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem(Constants.SYSTEM_PROMPT_PATH)
                .build();
    }

    /**
     * Retry template for AI calls with exponential backoff.
     * <p>
     * Retries on all exceptions EXCEPT non-transient AI errors
     * (e.g., invalid API key) which are immediately propagated.
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
