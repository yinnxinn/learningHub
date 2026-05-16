---
title: "金融 AI 与垂直领域大模型"
description: "面向金融市场的 AI 模型与工具：Kronos 金融基础模型、TradingAgents、FinGPT 及金融评测基准。"
url: "https://github.com/shiyu-coder/Kronos"
tags: ["Finance", "Kronos", "TradingAgents", "FinGPT", "Quant", "Financial AI", "垂直模型"]
contributor: "@zhima"
recommendation: 4
cover: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"
---

## 金融 AI 工具全景

金融是 LLM 应用最成熟的垂直领域之一，从**市场预测**到**风险管理**再到**量化交易**，已有大量开源项目覆盖。

---

## 头部项目

### Kronos — 金融市场基础模型

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/shiyu-coder/Kronos（25k+ ⭐） |
| **定位** | 金融市场语言的基础模型（Foundation Model for Language of Financial Markets） |
| **核心能力** | 市场趋势分析、金融文本理解、时间序列预测、情绪分析 |
| **今日趋势** | 2026-05-16 日增 372 stars，持续活跃 |
| **适用场景** | 量化研究、资产管理、风险控制、金融舆情监控 |

### TradingAgents — 多智能体金融交易框架

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/AI4Finance-Foundation/TradingAgents（75k+ ⭐） |
| **定位** | 多智能体 LLM 金融交易系统 |
| **核心架构** | 多 Agent 协作（数据分析 → 策略生成 → 回测 → 执行） |
| **能力** | 新闻解读、市场数据分析、量化策略生成、历史回测 |
| **突出优势** | 复旦大学 AI4Finance 团队出品；完整量化流程覆盖 |

### FinGPT — 金融大模型开源生态

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/AI4Finance-Foundation/FinGPT（10k+ ⭐） |
| **定位** | 面向金融的大语言模型开源生态 |
| **子项目** | FinRL（强化学习量化）/ FinRL-Meta（市场模拟）/ TiRegs（监管科技） |
| **数据源** | 接入 Bloomberg、Wind、Yahoo Finance 等金融数据 API |

---

## 评测基准

| 基准 | 机构 | 维度 |
|------|------|------|
| **BBH-Finance** | BigBench | 金融推理基准 |
| **FinanceMMLU** | 多机构 | 金融领域多任务理解 |
| **QuantEval** | 学术 | 量化策略生成质量评估 |

---

## 应用层级

```
Tier 1：数据获取与处理
  → AkShare（中文开源金融数据库）
  → Tushare Pro（A股/期货/基金数据）
  → CCXT（加密货币交易所聚合）

Tier 2：分析与理解
  → Kronos / FinGPT（金融文本理解 + 市场预测）
  → FinRL（强化学习量化）

Tier 3：策略与执行
  → TradingAgents（多 Agent 交易框架）
  → Backtrader / Zipline（回测引擎）
```

---

## 入门推荐

1. **Kronos**：金融 NLP 任务首选，GitHub 有完整文档和演示
2. **TradingAgents**：想了解多 Agent 在量化中如何协作的必读项目
3. **AkShare**：中文金融数据获取入门，覆盖 A 股/期货/基金/宏观数据
