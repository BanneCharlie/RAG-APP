package com.ai.project.controller;

import com.ai.project.common.Result;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Health check endpoint for monitoring and container orchestration.
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
}
