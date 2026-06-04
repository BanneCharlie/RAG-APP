package com.ai.project.service.impl;

import com.ai.project.entity.AiChatLog;
import com.ai.project.mapper.AiChatLogMapper;
import com.ai.project.service.AiChatLogService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * {@link AiChatLogService} 实现类 — 基于 MyBatis-Plus
 * <p>
 * 继承 {@link ServiceImpl} 的批量 CRUD 能力，并添加自定义查询方法。
 */
@Service
public class AiChatLogServiceImpl
        extends ServiceImpl<AiChatLogMapper, AiChatLog>
        implements AiChatLogService {

    /**
     * {@inheritDoc}
     */
    @Override
    public List<AiChatLog> getSessionHistory(String sessionId) {
        return lambdaQuery()
                .eq(AiChatLog::getSessionId, sessionId)
                .orderByAsc(AiChatLog::getCreateTime)
                .list();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public IPage<AiChatLog> pageQuery(int page, int size) {
        Page<AiChatLog> pageRequest = new Page<>(page, size);
        return baseMapper.selectPage(pageRequest, null);
    }
}
