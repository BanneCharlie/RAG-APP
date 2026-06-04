package com.ai.project.exception;

import lombok.Getter;

/**
 * 自定义业务异常，用于领域规则校验
 * <p>
 * 当违反业务规则时抛出（如余额不足、资源重复、状态变更非法）。
 * 由 {@link GlobalExceptionHandler} 统一捕获并转为 HTTP 响应。
 */
@Getter
public class BusinessException extends RuntimeException {

    private final int code;

    /**
     * @param code    业务错误码
     * @param message 人类可读的错误描述
     */
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * 快捷方法，错误码默认为 400
     */
    public static BusinessException of(String message) {
        return new BusinessException(400, message);
    }

    /**
     * 完整形式，指定错误码和消息
     */
    public static BusinessException of(int code, String message) {
        return new BusinessException(code, message);
    }
}
