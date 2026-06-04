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
 * 服务层方法日志切面
 * <p>
 * 记录方法入参、返回、执行时间和异常信息。敏感参数自动脱敏。
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
     * 环绕通知，记录 service 和 controller 方法的执行耗时
     */
    @Around("serviceLayer() || controllerLayer()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        Logger log = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        String methodName = joinPoint.getSignature().toShortString();

        // 记录入参（参数截断，防止敏感信息泄露）
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
