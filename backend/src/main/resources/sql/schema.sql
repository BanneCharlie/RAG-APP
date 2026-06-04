-- ==============================================================
-- 应用数据库表结构 — 兼容 MySQL（存储数据库）
-- 首次启动时通过 spring.sql.init 自动执行
-- ==============================================================

CREATE TABLE IF NOT EXISTS ai_chat_log (
    id                BIGINT       PRIMARY KEY,
    session_id        VARCHAR(128) NOT NULL,
    user_message      TEXT         NOT NULL,
    ai_reply          TEXT,
    model             VARCHAR(64),
    prompt_tokens     BIGINT       DEFAULT 0,
    completion_tokens BIGINT       DEFAULT 0,
    total_tokens      BIGINT       DEFAULT 0,
    create_time       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted        TINYINT      NOT NULL DEFAULT 0,
    INDEX idx_chat_log_session (session_id),
    INDEX idx_chat_log_create (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
