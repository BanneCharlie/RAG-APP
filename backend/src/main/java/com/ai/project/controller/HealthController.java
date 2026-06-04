package com.ai.project.controller;

import com.ai.project.common.Result;
import org.apache.coyote.Request;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * 健康检查端点，用于监控和容器编排
 */
@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Result<Map<String, Object>>> health() {
        return ResponseEntity.ok(Result.success(Map.of(
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "service", "ai-project-backend"
        )));
    }

    @GetMapping("/")
    public Result<String> index() {
        return Result.success("Welcome to AI Project!");
    }
}
