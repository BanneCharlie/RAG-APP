package com.ai.project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC 配置
 * <p>
 * 配置 CORS、拦截器和静态资源处理。
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // TODO: 已知前端 URL 后添加 CORS 映射
    // @Override
    // public void addCorsMappings(CorsRegistry registry) {
    //     registry.addMapping("/api/**")
    //             .allowedOrigins("http://localhost:3000")
    //             .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
    //             .allowCredentials(true);
    // }
}
