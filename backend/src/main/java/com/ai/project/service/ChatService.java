package com.ai.project.service;

import com.ai.project.dto.ChatRequest;
import com.ai.project.dto.ChatResponse;

/**
 * Service interface for AI chat operations.
 * <p>
 * Defines the contract for interacting with large language models
 * through Spring AI's abstraction layer.
 */
public interface ChatService {

    /**
     * Send a single prompt to the AI model and return the response.
     *
     * @param request the chat request containing the user's message
     * @return the AI-generated response with metadata
     */
    ChatResponse chat(ChatRequest request);

    /**
     * Stream a response from the AI model.
     * <p>
     * The callback receives partial response chunks as they arrive.
     *
     * @param request  the chat request
     * @param callback invoked for each content chunk
     */
    void streamChat(ChatRequest request, java.util.function.Consumer<String> callback);
}
