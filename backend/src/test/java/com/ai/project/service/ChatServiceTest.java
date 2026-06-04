package com.ai.project.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * {@link ChatService} 单元测试骨架
 * <p>
 * 使用 Mockito 模拟 {@code ChatClient} 依赖。
 * 配置了具体的 AI 供应商后补充完整测试覆盖。
 */
@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Test
    void serviceInterface_ShouldBeResolvable() {
        // 验证 ChatService 接口存在且可加载
        assertThat(ChatService.class).isInterface();
    }
}
