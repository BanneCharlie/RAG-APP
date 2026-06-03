package com.ai.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Chat request DTO received from the client.
 */
@Data
public class ChatRequest {

    @NotBlank(message = "Message must not be blank")
    @Size(max = 4096, message = "Message must not exceed 4096 characters")
    private String message;

    /**
     * Optional conversation/session ID for multi-turn chat.
     */
    private String sessionId;

    /**
     * Optional model override (e.g., "gpt-4o", "gpt-4o-mini").
     * If null, the default model configured in application.yml is used.
     */
    private String model;
}
