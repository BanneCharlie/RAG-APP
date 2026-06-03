package com.ai.project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration.
 * <p>
 * Configures CORS, interceptors, and static resource handling.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // TODO: Add CORS mapping when frontend URL is known
    // @Override
    // public void addCorsMappings(CorsRegistry registry) {
    //     registry.addMapping("/api/**")
    //             .allowedOrigins("http://localhost:3000")
    //             .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
    //             .allowCredentials(true);
    // }
}
