package com.ai.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 聊天记录实体 — 记录每次 AI 对话
 * <p>
 * 映射到 {@code ai_chat_log} 表，存储用户消息、AI 回复、
 * 使用的模型和 Token 消耗量（用于成本追踪）。
 * JPA + MyBatis-Plus 双注解兼容，开发环境由 Hibernate 自动建表。
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "ai_chat_log")
@TableName("ai_chat_log")
public class AiChatLog extends BaseEntity {

    @Id
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /** 多轮对话的会话标识 */
    @Column(nullable = false, length = 128)
    private String sessionId;

    /** 用户原始消息 */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String userMessage;

    /** AI 生成的回复 */
    @Column(columnDefinition = "TEXT")
    private String aiReply;

    /** 使用的 AI 模型（如 gpt-4o、gpt-4o-mini） */
    @Column(length = 64)
    private String model;

    /** 提示词 Token 数 */
    private Long promptTokens;

    /** 补全 Token 数 */
    private Long completionTokens;

    /** 总 Token 数（提示词 + 补全） */
    private Long totalTokens;
}
