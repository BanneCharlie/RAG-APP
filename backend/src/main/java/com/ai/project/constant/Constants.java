package com.ai.project.constant;

/**
 * Central constants for the application.
 * <p>
 * All magic strings and numeric constants should be defined here
 * to avoid duplication and improve maintainability.
 */
public final class Constants {

    private Constants() {
        // utility class
    }

    /** API version prefix. */
    public static final String API_V1 = "/api/v1";

    /** Default page size for paginated queries. */
    public static final int DEFAULT_PAGE_SIZE = 20;

    /** Max page size to prevent abuse. */
    public static final int MAX_PAGE_SIZE = 100;

    /** Default AI model timeout in seconds. */
    public static final int AI_TIMEOUT_SECONDS = 30;

    /** System prompt location. */
    public static final String SYSTEM_PROMPT_PATH = "classpath:/prompts/system-prompt.st";
}
