package com.ai.project.config;

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.BlockAttackInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus 配置
 * <p>
 * 注册分页插件和防 SQL 注入攻击保护。
 * Mapper 扫描基础包：{@code com.ai.project.mapper}。
 */
@Configuration
@MapperScan("com.ai.project.mapper")
public class MyBatisPlusConfig {

    /**
     * MyBatis-Plus 核心拦截器栈
     * <ul>
     *   <li>{@link PaginationInnerInterceptor} — 分页查询</li>
     *   <li>{@link BlockAttackInnerInterceptor} — 防止全表更新/删除</li>
     * </ul>
     * DbType 由数据源自动检测，开发环境为 H2，生产环境为 MySQL。
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();

        // 分页（实际 DbType 由数据源自动检测）
        PaginationInnerInterceptor pagination = new PaginationInnerInterceptor();
        pagination.setMaxLimit(500L);
        pagination.setOverflow(true);
        interceptor.addInnerInterceptor(pagination);

        // 安全防护：防止无 WHERE 条件的全表更新/删除
        interceptor.addInnerInterceptor(new BlockAttackInnerInterceptor());

        return interceptor;
    }
}
