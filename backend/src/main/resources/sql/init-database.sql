-- ==============================================================
-- 初始化数据库（首次使用 MySQL 时手动执行一次）
-- 用法：mysql -u root -p < init-database.sql
-- ==============================================================

CREATE DATABASE IF NOT EXISTS rag_app
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

-- 创建完后切换到 rag_app 库，schema.sql 会在应用启动时自动执行
USE rag_app;
