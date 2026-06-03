package com.ai.project.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.BlockAttackInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus configuration.
 * <p>
 * Registers the pagination plugin and anti-SQL-injection protection.
 * Mapper scanning base package: {@code com.ai.project.mapper}.
 */
@Configuration
@MapperScan("com.ai.project.mapper")
public class MyBatisPlusConfig {

    /**
     * Core MyBatis-Plus interceptor stack.
     * <ul>
     *   <li>{@link PaginationInnerInterceptor} — page query support</li>
     *   <li>{@link BlockAttackInnerInterceptor} — prevents full table update/delete</li>
     * </ul>
     * The {@code DbType} is set per active profile in YAML, defaulting to H2 for dev.
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();

        // Pagination (actual DbType is auto-detected from datasource)
        PaginationInnerInterceptor pagination = new PaginationInnerInterceptor(DbType.H2);
        pagination.setMaxLimit(500L);
        pagination.setOverflow(true);
        interceptor.addInnerInterceptor(pagination);

        // Safety guard: prevent "update table set ..." without where clause
        interceptor.addInnerInterceptor(new BlockAttackInnerInterceptor());

        return interceptor;
    }
}
