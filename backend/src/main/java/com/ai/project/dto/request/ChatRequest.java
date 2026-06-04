package com.ai.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 聊天请求 DTO，接收客户端传入的消息
 */
@Data
public class ChatRequest {

    @NotBlank(message = "消息不能为空")
    @Size(max = 4096, message = "消息长度不能超过 4096 个字符")
    private String message;

    /**
     * 可选：多轮对话的会话 ID
     */
    private String sessionId;

    /**
     * 可选：指定模型名称（如 gpt-4o、gpt-4o-mini）
     * 为空时使用 application.yml 中配置的默认模型
     */
    private String model;
}
