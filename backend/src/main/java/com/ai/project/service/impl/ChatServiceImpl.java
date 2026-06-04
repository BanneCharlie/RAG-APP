package com.ai.project.service.impl;

import com.ai.project.dto.request.ChatRequest;
import com.ai.project.dto.response.ChatResponse;
import com.ai.project.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.function.Consumer;

/**
 * {@link ChatService} 实现 — 基于 Spring AI 的 {@link ChatClient}
 * <p>
 * 委托给配置的 AI 模型（默认 OpenAI），内置重试和可观测性。
 */
@Service
public class ChatServiceImpl implements ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatServiceImpl.class);

    private final ChatClient chatClient;
    private final RetryTemplate retryTemplate;

    public ChatServiceImpl(ChatClient chatClient, RetryTemplate retryTemplate) {
        this.chatClient = chatClient;
        this.retryTemplate = retryTemplate;
    }

    @Override
    public ChatResponse chat(ChatRequest request) {
        log.info("收到聊天请求，消息长度={}", request.getMessage().length());

        return retryTemplate.execute(context -> {
            long start = System.currentTimeMillis();

            ChatClient.CallResponseSpec response = chatClient.prompt()
                    .user(request.getMessage())
                    .call();

            String content = response.content();
            org.springframework.ai.chat.model.ChatResponse aiResponse = response.chatResponse();

            long elapsed = System.currentTimeMillis() - start;
            log.info("AI 响应接收完毕，耗时 {} ms", elapsed);

            // 构建 Token 使用信息
            ChatResponse.TokenUsage usage = ChatResponse.TokenUsage.builder().build();
            if (aiResponse != null && aiResponse.getMetadata() != null
                    && aiResponse.getMetadata().getUsage() != null) {
                var aiUsage = aiResponse.getMetadata().getUsage();
                usage = ChatResponse.TokenUsage.builder()
                        .promptTokens(aiUsage.getPromptTokens() != null ? aiUsage.getPromptTokens() : 0)
                        .completionTokens(aiUsage.getCompletionTokens() != null ? aiUsage.getCompletionTokens() : 0)
                        .totalTokens(aiUsage.getTotalTokens() != null ? aiUsage.getTotalTokens() : 0)
                        .build();
            }

            return ChatResponse.builder()
                    .reply(content)
                    .model(aiResponse != null && aiResponse.getMetadata() != null
                            ? aiResponse.getMetadata().getModel() : "unknown")
                    .usage(usage)
                    .build();
        });
    }

    @Override
    public void streamChat(ChatRequest request, Consumer<String> callback) {
        log.info("流式聊天请求，消息长度={}", request.getMessage().length());

        Flux<String> stream = chatClient.prompt()
                .user(request.getMessage())
                .stream()
                .content();

        stream.subscribe(
                callback::accept,
                error -> log.error("流式传输错误: {}", error.getMessage()),
                () -> log.info("流式传输完成")
        );
    }
}
