package com.ai.project.mapper;

import com.ai.project.entity.AiChatLog;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * MyBatis-Plus Mapper for {@link AiChatLog}.
 * <p>
 * Inherits built-in CRUD methods from {@link BaseMapper}:
 * {@code insert}, {@code deleteById}, {@code updateById},
 * {@code selectById}, {@code selectPage}, etc.
 */
@Mapper
public interface AiChatLogMapper extends BaseMapper<AiChatLog> {
}
