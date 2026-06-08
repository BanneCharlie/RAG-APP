-- ==============================================================
-- 应用数据库表结构
--
-- 实体类:                                    →  表字段:
--   AiChatLog.id          (Long, ASSIGN_ID)  →  id              BIGINT
--   AiChatLog.sessionId   (String, 128)      →  session_id      VARCHAR(128)
--   AiChatLog.userMessage (String, TEXT)      →  user_message    TEXT
--   AiChatLog.aiReply     (String, TEXT)      →  ai_reply        TEXT
--   AiChatLog.model       (String, 64)        →  model           VARCHAR(64)
--   AiChatLog.promptTokens      (Long)        →  prompt_tokens   BIGINT
--   AiChatLog.completionTokens  (Long)        →  completion_tokens BIGINT
--   AiChatLog.totalTokens       (Long)        →  total_tokens    BIGINT
--   BaseEntity.createTime (LocalDateTime)      →  create_time     DATETIME
--   BaseEntity.updateTime (LocalDateTime)      →  update_time     DATETIME
--   BaseEntity.deleted    (Integer, is_deleted)→  is_deleted      TINYINT
-- ==============================================================

CREATE TABLE IF NOT EXISTS ai_chat_log (
    -- AiChatLog.id (@TableId ASSIGN_ID → 雪花算法生成)
    id                BIGINT       PRIMARY KEY COMMENT '主键ID（雪花算法）',

    -- AiChatLog.sessionId (@Column length=128)
    session_id        VARCHAR(128) NOT NULL  COMMENT '会话标识（多轮对话关联）',

    -- AiChatLog.userMessage (@Column columnDefinition=TEXT)
    user_message      TEXT         NOT NULL  COMMENT '用户消息原文',

    -- AiChatLog.aiReply (@Column columnDefinition=TEXT)
    ai_reply          TEXT                   COMMENT 'AI 回复内容',

    -- AiChatLog.model (@Column length=64)
    model             VARCHAR(64)            COMMENT 'AI 模型名称（如 gpt-4o）',

    -- AiChatLog.promptTokens
    prompt_tokens     BIGINT       DEFAULT 0 COMMENT '提示词 Token 消耗',

    -- AiChatLog.completionTokens
    completion_tokens BIGINT       DEFAULT 0 COMMENT '补全 Token 消耗',

    -- AiChatLog.totalTokens
    total_tokens      BIGINT       DEFAULT 0 COMMENT '总 Token 消耗',

    -- BaseEntity.createTime (@TableField fill=INSERT)
    create_time       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    -- BaseEntity.updateTime (@TableField fill=INSERT_UPDATE)
    update_time       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- BaseEntity.deleted (@TableLogic, @TableField="is_deleted")
    is_deleted        TINYINT      NOT NULL DEFAULT 0 COMMENT '逻辑删除（0=正常, 1=删除）',

    INDEX idx_chat_log_session (session_id),
    INDEX idx_chat_log_create (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI 对话聊天记录表';
