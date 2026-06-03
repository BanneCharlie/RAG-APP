package com.ai.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * AI Project Backend - Spring Boot Application Entry Point.
 * <p>
 * Built with Spring Boot 4.0.6 + Spring AI 2.0.0-M7, targeting Java 21.
 * Provides RESTful APIs for AI-powered chat, document processing, and more.
 *
 * @author AI Project Team
 */
@SpringBootApplication
@EnableJpaAuditing
@ConfigurationPropertiesScan
public class AiProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiProjectApplication.class, args);
    }
}
