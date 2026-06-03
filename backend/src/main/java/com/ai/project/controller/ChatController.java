package com.ai.project.controller;

import com.ai.project.common.Result;
import com.ai.project.constant.Constants;
import com.ai.project.dto.ChatRequest;
import com.ai.project.dto.ChatResponse;
import com.ai.project.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

/**
 * REST controller for AI chat interactions.
 * <p>
 * Exposes synchronous and streaming chat endpoints.
 */
@RestController
@RequestMapping(Constants.API_V1 + "/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * Synchronous chat: sends a message to the AI model and returns the full reply.
     *
     * @param request the chat request with user message
     * @return the AI response wrapped in a standard Result
     */
    @PostMapping
    public Result<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.chat(request);
        return Result.success(response);
    }

    /**
     * Streaming chat: sends a message and receives the reply as a Server-Sent Events stream.
     *
     * @param request the chat request with user message
     * @return a Flux stream of response chunks
     */
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(@Valid @RequestBody ChatRequest request) {
        return Flux.create(sink -> {
            chatService.streamChat(request, chunk -> {
                sink.next("data: " + chunk + "\n\n");
            });
            sink.complete();
        });
    }
}
