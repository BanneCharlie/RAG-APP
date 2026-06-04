package com.ai.project.service;

import com.ai.project.entity.AiChatLog;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * {@link AiChatLog} 服务接口
 * <p>
 * 继承 MyBatis-Plus {@link IService}，提供 save、saveBatch、
 * updateById、list、page 等基础方法。
 */
public interface AiChatLogService extends IService<AiChatLog> {

    /**
     * 获取指定会话的聊天记录，按时间升序排列
     *
     * @param sessionId 会话 ID
     * @return 聊天记录列表（按时间升序）
     */
    List<AiChatLog> getSessionHistory(String sessionId);

    /**
     * 分页查询所有聊天记录
     *
     * @param page 当前页码（从 1 开始）
     * @param size 每页大小
     * @return 分页结果
     */
    IPage<AiChatLog> pageQuery(int page, int size);
}
