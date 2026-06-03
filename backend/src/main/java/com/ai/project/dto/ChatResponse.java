package com.ai.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Chat response DTO returned to the client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    /**
     * The AI-generated reply text.
     */
    private String reply;

    /**
     * Model used for generating the response.
     */
    private String model;

    /**
     * Approximate token usage for cost tracking.
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
