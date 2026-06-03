package com.ai.project.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Base entity with common audit fields.
 * <p>
 * All database entities should extend this class to ensure
 * consistent auditing (creation time, update time, soft-delete).
 */
@Data
public abstract class BaseEntity {

    /**
     * Creation timestamp — auto-filled on insert.
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * Last-update timestamp — auto-filled on insert & update.
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * Soft-delete flag (0 = normal, 1 = deleted).
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer deleted;
}
