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
 * Implementation of {@link AiChatLogService} using MyBatis-Plus.
 * <p>
 * Inherits bulk CRUD from {@link ServiceImpl} and adds
 * custom query methods.
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
