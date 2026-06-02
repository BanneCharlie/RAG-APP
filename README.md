# 🚀 RAG-Insight-System (智巡 RAG 系统)

[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Node Version](https://img.shields.io/badge/Node-18%2B-green.svg)](https://nodejs.org/)
[![Stage](https://img.shields.io/badge/Status-Developing-orange.svg)]()

> **RAG-Insight-System** 是一款基于前后端分离架构的企业级检索增强生成 (RAG) 知识库应用。系统结合了前沿的大语言模型 (LLM) 与高效的向量检索技术，旨在打通企业私有文档的“最后一公里”，提供精准、实时、具备溯源能力的智能问答与知识管理体验。

---

## 🌟 核心特性

*   **⚡ 双引擎混合检索**：融合传统稠密向量检索 (Dense Retrieval) 与稀疏文本检索 (BM25)，在专有名词与语义理解上达到完美平衡。
*   **🔄 动态文档分块与解析**：内置智能 Markdown/PDF/Docx 解析器，支持基于语义的高级文本分块 (Chunking) 策略，保留上下文连续性。
*   **💬 流式打字机交互**：前端采用 SSE (Server-Sent Events) 技术，实现毫秒级响应的 LLM 流式文本输出，极速交互不等待。
*   **🔗 引用溯源追踪**：每一句 AI 回答均可精准追溯至原始文档的具体段落与页码，拒绝大模型幻觉，确保答案真实可靠。
*   **🛠️ 模块化插拔设计**：后端核心基于 Monorepo 架构设计，支持 LangChain/LlamaIndex 快速切换，轻松对接各类主流商用或开源本地大模型。

---

## 🏗️ 系统架构图

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          Frontend (Next.js / Vue)                      │
│                Chat UI  │  Document Management  │  Analytics           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (RESTful API / SSE)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          Backend (FastAPI)                             │
│   ┌───────────────────────┐  ┌───────────────────┐  ┌──────────────┐   │
│   │   Document Pipeline   │  │   RAG Core Core   │  │  LLM Adaptor │   │
│   │ (Parser / TextSplit)  │  │ (Hybrid Retrieve) │  │(Stream Engine)   │
│   └───────────┬───────────┘  └─────────┬─────────┘  └──────┬───────┘   │
└───────────────┼────────────────────────┼───────────────────┼───────────┘
                ▼                        ▼                   ▼
     ┌─────────────────────┐  ┌────────────────────┐  ┌──────────────┐
     │  Storage (MinIO)    │  │  VectorDB (Chroma) │  │ LLM API / OLLAMA
     └─────────────────────┘  └────────────────────┘  └──────────────┘