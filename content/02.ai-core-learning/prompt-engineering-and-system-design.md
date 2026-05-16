---
title: "Prompt Engineering 与 AI 系统设计指南"
description: "从提示工程到 AI 系统架构的结构化学习路径，覆盖从入门到生产级部署的全链路。"
url: "https://www.promptingguide.ai/zh"
tags: ["Prompt Engineering", "System Design", "RAG", "Agent", "Production"]
contributor: "@zhima"
recommendation: 5
cover: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80"
---

## 核心资源

### 提示工程
- **Prompt Engineering Guide（中文版）**: https://www.promptingguide.ai/zh  
  系统覆盖零样本、少样本、思维链（CoT）、ReAct 等主流策略
- **OpenAI Prompt Engineering Docs**: https://platform.openai.com/docs/guides/prompt-engineering  
  官方最佳实践，随模型版本同步更新
- **Anthropic Prompt Library**: https://docs.anthropic.com/zh-CN/prompt-library/library  
  Claude 特化模板，适合提示迁移参考

### AI 系统设计
- **LLM Patterns**: https://eugeneyan.com/writing/llm-patterns/  
  推荐系统专家 Eugene Yan 整理的生产级 LLM 模式（Evals、RAG、Fine-tuning 等）
- **Building LLM Applications**: https://huyenchip.com/blog/  
  Chip Huyen 的 AI 工程博客，系统设计视角，覆盖可靠性、延迟、成本权衡
- **The Illustrated Transformer**: https://jalammar.github.io/illustrated-transformer/  
  Transformer 架构可视化讲解，必读经典

## 学习路径建议

```
基础概念
  → Prompt Engineering Guide（通读一遍）
  → The Illustrated Transformer（建立架构直觉）

工程实践
  → OpenAI / Anthropic 官方文档（了解产品约束）
  → LLM Patterns（理解生产问题）

深度系统设计
  → Chip Huyen Blog（系统思维）
  → 动手构建 RAG + Agent 原型
```

## 2025 年重点关注

- **Structured Output**：JSON mode、tool calling 的可靠性技巧
- **Context Management**：超长上下文下的信息压缩与检索策略
- **Agentic Patterns**：多步推理、工具调用、错误恢复的设计模式
