package com.ai.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Chat log entity — records every AI conversation turn.
 * <p>
 * Mapped to the {@code ai_chat_log} table. Stores the user message,
 * the AI reply, model used, and token consumption for cost tracking.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ai_chat_log")
public class AiChatLog extends BaseEntity {

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /** Session identifier for multi-turn conversations. */
    private String sessionId;

    /** Original user message. */
    private String userMessage;

    /** AI-generated reply. */
    private String aiReply;

    /** AI model used (e.g., gpt-4o, gpt-4o-mini). */
    private String model;

    /** Prompt token count. */
    private Long promptTokens;

    /** Completion token count. */
    private Long completionTokens;

    /** Total token count (prompt + completion). */
    private Long totalTokens;
}
