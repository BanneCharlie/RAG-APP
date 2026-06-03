package com.ai.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Asynchronous task execution configuration.
 * <p>
 * Provides a dedicated thread pool for {@code @Async} methods
 * such as long-running AI calls or batch processing tasks.
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * Application-scoped async executor.
     * Core pool size = CPU cores, max = 2x CPU cores for burst handling.
     */
    @Bean("aiTaskExecutor")
    public Executor aiTaskExecutor() {
        int cores = Runtime.getRuntime().availableProcessors();
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(cores);
        executor.setMaxPoolSize(cores * 2);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("ai-async-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }
}
