package com.ai.project.service;

import com.ai.project.entity.AiChatLog;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * Service interface for {@link AiChatLog} operations.
 * <p>
 * Extends MyBatis-Plus {@link IService} which provides:
 * save, saveBatch, updateById, list, page, etc.
 */
public interface AiChatLogService extends IService<AiChatLog> {

    /**
     * Retrieve chat history for a given session, ordered by time ascending.
     *
     * @param sessionId the conversation session ID
     * @return ordered list of chat logs
     */
    List<AiChatLog> getSessionHistory(String sessionId);

    /**
     * Paginated query of all chat logs.
     *
     * @param page current page number (1-based)
     * @param size page size
     * @return paginated result
     */
    IPage<AiChatLog> pageQuery(int page, int size);
}
