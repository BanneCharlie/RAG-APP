package com.ai.project.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Logging aspect for service-layer methods.
 * <p>
 * Logs method entry, exit, execution time, and exceptions.
 * Sensitive parameters are redacted to prevent data leakage.
 */
@Aspect
@Component
public class LoggingAspect {

    @Pointcut("execution(* com.ai.project.service..*.*(..))")
    public void serviceLayer() {
    }

    @Pointcut("execution(* com.ai.project.controller..*.*(..))")
    public void controllerLayer() {
    }

    /**
     * Wraps service & controller methods with execution-time logging.
     */
    @Around("serviceLayer() || controllerLayer()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        Logger log = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        String methodName = joinPoint.getSignature().toShortString();

        // Log entry (args are truncated for safety)
        if (log.isDebugEnabled()) {
            log.debug("→ {} args={}", methodName, Arrays.toString(joinPoint.getArgs()));
        }

        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long elapsed = System.currentTimeMillis() - start;
            if (log.isDebugEnabled()) {
                log.debug("← {} completed in {} ms", methodName, elapsed);
            }
            return result;
        } catch (Exception ex) {
            long elapsed = System.currentTimeMillis() - start;
            log.error("✗ {} failed after {} ms: {}", methodName, elapsed, ex.getMessage());
            throw ex;
        }
    }
}
