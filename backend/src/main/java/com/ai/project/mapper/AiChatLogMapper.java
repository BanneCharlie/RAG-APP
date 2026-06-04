package com.ai.project.mapper;

import com.ai.project.entity.AiChatLog;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * MyBatis-Plus Mapper — {@link AiChatLog} 数据访问层
 * <p>
 * 继承 {@link BaseMapper} 提供的内置 CRUD 方法：
 * insert、deleteById、updateById、selectById、selectPage 等
 */
@Mapper
public interface AiChatLogMapper extends BaseMapper<AiChatLog> {
}
