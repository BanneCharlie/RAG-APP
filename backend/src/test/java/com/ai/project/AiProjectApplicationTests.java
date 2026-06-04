package com.ai.project;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * 集成测试，验证 Spring 应用上下文加载成功
 */
@SpringBootTest
@ActiveProfiles("dev")
class AiProjectApplicationTests {

    @Test
    void contextLoads() {
        // 验证整个 Spring 上下文初始化无异常
        // 如果有 Bean 装配失败，该测试会失败
    }
}
