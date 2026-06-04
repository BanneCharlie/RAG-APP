package com.ai.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 聊天响应 DTO，返回给客户端
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    /**
     * AI 生成的回复文本
     */
    private String reply;

    /**
     * 生成回复所使用的模型名称
     */
    private String model;

    /**
     * 近似 Token 消耗量，用于成本追踪
     */
    private TokenUsage usage;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TokenUsage {
        private long promptTokens;
        private long completionTokens;
        private long totalTokens;
    }
}
