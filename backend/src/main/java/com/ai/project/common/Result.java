package com.ai.project.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.Instant;

/**
 * Unified API response wrapper.
 * <p>
 * All controller endpoints return this structure to ensure consistent
 * serialization for the frontend.
 *
 * @param <T> the type of the response data payload
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result<T> {

    private int code;
    private String message;
    private T data;
    private Instant timestamp;

    private Result() {
        this.timestamp = Instant.now();
    }

    private Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = Instant.now();
    }

    // ---- Success ----

    /**
     * Success with data and default status code 200.
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }

    /**
     * Success with no data payload.
     */
    public static <T> Result<T> success() {
        return new Result<>(200, "success", null);
    }

    // ---- Error ----

    /**
     * Error with a custom code and message.
     */
    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message, null);
    }

    /**
     * Server internal error (500).
     */
    public static <T> Result<T> serverError(String message) {
        return new Result<>(500, message, null);
    }

    /**
     * Bad request (400).
     */
    public static <T> Result<T> badRequest(String message) {
        return new Result<>(400, message, null);
    }

    /**
     * Resource not found (404).
     */
    public static <T> Result<T> notFound(String message) {
        return new Result<>(404, message, null);
    }
}
