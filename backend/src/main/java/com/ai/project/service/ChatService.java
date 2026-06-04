package com.ai.project.service;

import com.ai.project.dto.request.ChatRequest;
import com.ai.project.dto.response.ChatResponse;

/**
 * AI 聊天服务接口
 * <p>
 * 定义通过 Spring AI 抽象层与大语言模型交互的契约。
 */
public interface ChatService {

    /**
     * 发送单条消息给 AI 模型并返回响应
     *
     * @param request 包含用户消息的聊天请求
     * @return AI 生成的回复及元数据
     */
    ChatResponse chat(ChatRequest request);

    /**
     * 流式获取 AI 回复
     * <p>
     * 回调函数会逐块接收回复内容。
     *
     * @param request  聊天请求
     * @param callback 每块内容到达时调用
     */
    void streamChat(ChatRequest request, java.util.function.Consumer<String> callback);
}
