package com.ai.project.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 实体基类，包含通用审计字段
 * <p>
 * 所有数据库实体应继承此类，确保创建时间、更新时间、
 * 逻辑删除等审计字段的一致性。
 * JPA + MyBatis-Plus 双注解兼容。
 */
@Data
@MappedSuperclass
public abstract class BaseEntity {

    /**
     * 创建时间 — 插入时自动填充
     */
    @TableField(fill = FieldFill.INSERT)
    @Column(nullable = false, updatable = false)
    private LocalDateTime createTime;

    /**
     * 更新时间 — 插入和更新时自动填充
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除标记（0 = 正常，1 = 已删除）
     */
    @TableLogic
    @TableField("is_deleted")
    @Column(name = "is_deleted", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private Integer deleted;
}
