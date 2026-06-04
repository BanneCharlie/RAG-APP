package com.ai.project.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.Instant;

/**
 * 统一 API 响应封装
 * <p>
 * 所有 Controller 都返回此结构，确保前端序列化格式一致。
 *
 * @param <T> 响应数据类型
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

    // ---- 成功响应 ----

    /**
     * 成功并返回数据，状态码 200
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }

    /**
     * 成功但不返回数据
     */
    public static <T> Result<T> success() {
        return new Result<>(200, "success", null);
    }

    // ---- 错误响应 ----

    /**
     * 自定义错误码和消息
     */
    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message, null);
    }

    /**
     * 服务器内部错误（500）
     */
    public static <T> Result<T> serverError(String message) {
        return new Result<>(500, message, null);
    }

    /**
     * 请求参数错误（400）
     */
    public static <T> Result<T> badRequest(String message) {
        return new Result<>(400, message, null);
    }

    /**
     * 资源未找到（404）
     */
    public static <T> Result<T> notFound(String message) {
        return new Result<>(404, message, null);
    }
}
