---
title: "AI 应用开发工具链（LangChain / LlamaIndex / DSPy）"
description: "主流 AI 应用开发框架对比与选型指南，帮助快速启动 RAG、Agent 与管道类项目。"
url: "https://python.langchain.com/docs/introduction/"
tags: ["LangChain", "LlamaIndex", "DSPy", "Framework", "RAG", "Agent"]
contributor: "@zhima"
recommendation: 4
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
---

## 主流框架概览

| 框架 | 定位 | 适用场景 | 文档 |
|------|------|---------|------|
| **LangChain** | 通用 LLM 应用编排框架 | RAG、Agent、链式调用 | https://python.langchain.com/docs/introduction/ |
| **LlamaIndex** | 数据索引与检索增强 | 文档 Q&A、知识库检索 | https://docs.llamaindex.ai/ |
| **DSPy** | 声明式 LLM 程序设计 | 提示优化、复杂推理管道 | https://dspy-docs.vercel.app/ |
| **Instructor** | 结构化输出验证 | Pydantic 模型驱动的数据提取 | https://python.useinstructor.com/ |

## 框架选型建议

```
快速验证 / 原型
  → LangChain（生态最大，文档最全，组件丰富）

文档密集型应用（企业知识库、PDF 问答）
  → LlamaIndex（索引策略更专业，检索评估工具完善）

需要自动优化提示 / 系统级优化
  → DSPy（基于训练数据自动调优提示，减少人工调参）

严格要求结构化输出
  → Instructor（与任意 LLM 配合，Pydantic 验证）
```

## 2025 年趋势

- **LangGraph**（LangChain 子项目）：专为有状态 Agent 工作流设计，支持循环、分支、人工介入
- **LlamaIndex Workflows**：新的事件驱动工作流模型，替代原有 Pipeline 方式
- **框架趋于轻量化**：越来越多开发者选择直接调用原生 SDK（OpenAI / Anthropic）+ 手写简单抽象，而非引入重框架

## 入门推荐顺序

1. 先跑通 OpenAI/Anthropic 原生 API 调用
2. 用 LangChain 完成一个 RAG 小项目
3. 尝试 LlamaIndex 替换向量检索部分，对比体验
4. 遇到复杂 Agent 场景时引入 LangGraph
