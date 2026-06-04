package com.ai.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * 异步任务执行配置
 * <p>
 * 为 {@code @Async} 方法提供专用线程池，适用于长时间运行的
 * AI 调用或批量处理任务。
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * 应用级异步执行器
     * 核心线程数 = CPU 核数，最大线程数 = 2x 核数（应对突发流量）
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
