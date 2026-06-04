package com.ai.project.controller;

import com.ai.project.common.Result;
import com.ai.project.constant.Constants;
import com.ai.project.dto.request.ChatRequest;
import com.ai.project.dto.response.ChatResponse;
import com.ai.project.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

/**
 * AI 对话 REST 控制器
 * <p>
 * 提供同步聊天和流式聊天两种接口。
 */
@RestController
@RequestMapping(Constants.API_V1 + "/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * 同步聊天：发送消息给 AI 模型，返回完整回复
     *
     * @param request 包含用户消息的聊天请求
     * @return 包装在 Result 中的 AI 回复
     */
    @PostMapping
    public Result<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.chat(request);
        return Result.success(response);
    }

    /**
     * 流式聊天：以 SSE 流式返回 AI 回复
     *
     * @param request 包含用户消息的聊天请求
     * @return Flux 流，每个元素为一块回复内容
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
