package com.ai.project;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Integration test verifying the application context loads successfully.
 */
@SpringBootTest
@ActiveProfiles("dev")
class AiProjectApplicationTests {

    @Test
    void contextLoads() {
        // Verifies that the entire Spring context initialises without errors.
        // If any bean fails to wire, this test will fail.
    }
}
