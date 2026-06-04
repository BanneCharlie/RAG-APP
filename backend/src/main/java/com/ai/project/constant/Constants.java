package com.ai.project.constant;

/**
 * 应用常量集中管理
 * <p>
 * 所有魔法字符串和数字常量应在此定义，避免重复并提高可维护性。
 */
public final class Constants {

    private Constants() {
        // utility class
    }

    /** API 版本前缀 */
    public static final String API_V1 = "/api/v1";

    /** 分页查询默认每页大小 */
    public static final int DEFAULT_PAGE_SIZE = 20;

    /** 每页最大大小，防止滥用 */
    public static final int MAX_PAGE_SIZE = 100;

    /** AI 模型调用默认超时（秒） */
    public static final int AI_TIMEOUT_SECONDS = 30;

    /** 系统提示词文件路径 */
    public static final String SYSTEM_PROMPT_PATH = "classpath:/prompts/system-prompt.st";
}
