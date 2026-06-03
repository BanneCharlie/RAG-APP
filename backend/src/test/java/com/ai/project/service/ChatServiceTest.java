package com.ai.project.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit test skeleton for {@link ChatService}.
 * <p>
 * Uses Mockito to mock the {@code ChatClient} dependency.
 * Full test coverage is added when a concrete AI provider is configured.
 */
@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Test
    void serviceInterface_ShouldBeResolvable() {
        // Verify that the ChatService interface exists and is loadable
        assertThat(ChatService.class).isInterface();
    }
}
