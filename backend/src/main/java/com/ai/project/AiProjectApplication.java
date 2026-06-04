package com.ai.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * AI 项目后端 - Spring Boot 应用入口
 * <p>
 * 提供 AI 对话、文档处理等 RESTful API。
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
