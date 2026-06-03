package com.ai.project.exception;

import lombok.Getter;

/**
 * Custom business exception for domain-level errors.
 * <p>
 * Thrown when a business rule is violated (e.g., insufficient balance,
 * duplicate resource, invalid state transition). Caught by
 * {@link GlobalExceptionHandler} and translated to a proper HTTP response.
 */
@Getter
public class BusinessException extends RuntimeException {

    private final int code;

    /**
     * @param code    custom business error code
     * @param message human-readable error description
     */
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * Shorthand with code defaulting to 400.
     */
    public static BusinessException of(String message) {
        return new BusinessException(400, message);
    }

    /**
     * Full form.
     */
    public static BusinessException of(int code, String message) {
        return new BusinessException(code, message);
    }
}
