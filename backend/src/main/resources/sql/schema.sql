-- ==============================================================
-- Application schema — compatible with H2 (dev) and PostgreSQL (prod)
-- Auto-executed via spring.sql.init when spring.jpa.ddl-auto
-- is set to "none" or "validate" (i.e., when JPA DDL is off).
-- ==============================================================

CREATE TABLE IF NOT EXISTS ai_chat_log (
    id                BIGINT       PRIMARY KEY,
    session_id        VARCHAR(128) NOT NULL,
    user_message      CLOB         NOT NULL,
    ai_reply          CLOB,
    model             VARCHAR(64),
    prompt_tokens     BIGINT       DEFAULT 0,
    completion_tokens BIGINT       DEFAULT 0,
    total_tokens      BIGINT       DEFAULT 0,
    create_time       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted        TINYINT      NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_chat_log_session ON ai_chat_log(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_log_create ON ai_chat_log(create_time);
