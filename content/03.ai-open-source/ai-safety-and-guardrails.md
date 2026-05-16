---
title: "AI 安全、对齐与防护工具链"
description: "构建可信赖 AI 应用的安全工具链：护栏（Guardrails）、结构化输出、对齐评测与红队测试资源。"
url: "https://github.com/NVIDIA/NeMo-Guardrails"
tags: ["AI Safety", "Guardrails", "Alignment", "Red Teaming", "NeMo", "LMQL", "Guidance", "Outlines"]
contributor: "@zhima"
recommendation: 4
cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
---

## 为什么需要安全工具链

LLM 应用在实际部署中面临四类核心风险：

| 风险类型 | 典型案例 | 防护手段 |
|---------|---------|---------|
| **越狱攻击（Jailbreak）** | 角色扮演诱导泄露敏感信息 | Guardrails 护栏 |
| **有害内容** | 生成暴力/歧视/违法内容 | 内容过滤 + 主题控制 |
| **幻觉（Hallucination）** | 自信输出错误事实 | 结构化输出 + 引用验证 |
| **Prompt 注入** | 用户输入中隐藏恶意指令 | 输入验证 + 隔离执行 |

---

## 主流护栏（Guardrails）框架

### NeMo Guardrails — NVIDIA 企业级方案

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/NVIDIA/NeMo-Guardrails（8k+ ⭐） |
| **定位** | 可编程的 AI 安全防护编排平台 |
| **核心能力** | 话题控制 / 有害内容过滤 / 越狱检测 / 输入输出双重验证 |
| **编排方式** | Colang 语言定义对话流程（类 YAML DSL） |
| **LLM 集成** | 支持任意 LangChain LLM，可配置自托管模型 |
| **突出优势** | 企业级；可热更新规则；NVIDIA 生态背书 |
| **适用场景** | 企业客服 Agent；金融/医疗合规场景；多语言应用 |

```colang
# NeMo Guardrails 示例：禁止讨论敏感话题
define user ask about weapons
  "how to make a bomb"
  "weapons manufacturing"

define bot refuse weapons
  "抱歉，我无法协助与此相关的请求。"
  engagement: medium

# 将用户意图映射到机器人的回应
when user ask about weapons do bot refuse weapons
```

### Guardrails AI — 轻量级方案

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/guardrails-ai/guardrails-ai（5k+ ⭐） |
| **定位** | Pydantic 原生，数据验证驱动的护栏 |
| **核心能力** | 结构化输出验证 / 有害内容检测 / 事实一致性检查 |
| **集成方式** | `@guardrails.validate()` 装饰器 / LangChain / LlamaIndex |
| **突出优势** | 轻量；与 Pydantic 深度集成；规则即代码 |

### Llama Guard — 开源内容安全模型

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/meta-llama/PurpleLlama（Meta 安全工具集） |
| **定位** | Meta 推出的开源内容安全分类模型 |
| **模型** | Llama Guard 3（8B / 11B Vision） |
| **能力** | 7 类有害内容检测（S1-S7）；可微调适配业务场景 |
| **适用场景** | 自托管环境的内容安全审核；不想依赖外部 API 的场景 |

---

## 结构化输出工具

解决 LLM 输出格式不可控、幻觉、难以解析的问题。

### Outlines — 确定性生成

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/outlines-dev/outlines（9k+ ⭐） |
| **定位** | 确定性结构化输出生成（无需 JSON schema 解析） |
| **核心能力** | Regex / JSON Schema / Pydantic 模型约束；支持 vLLM / llama.cpp 等推理后端 |
| **优势** | 生成即合规，无二次解析损耗；避免 JSON 解析失败 |

```python
from pydantic import BaseModel
from outlines import models, generate

class Recipe(BaseModel):
    title: str
    ingredients: list[str]
    steps: list[str]

model = models.llama("meta-llama/LLlama-3-8B-Instruct")
recipe = generate.json(model, Recipe)("给我一个蛋炒饭的食谱")
```

### Guidance — 微软结构化控制

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/guidance-ai/guidance（10k+ ⭐） |
| **定位** | 微软的 token 级别输出控制语言 |
| **核心能力** | 模板语法 + 变量约束 + 条件分支 + 工具调用 |
| **优势** | 可中途暂停检查中间结果；与 Azure OpenAI 深度集成 |

### LMQL — 约束式 LLM 编程语言

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/eth-sri/lmql（4k+ ⭐） |
| **定位** | 将 LLM 输出约束写成类 SQL 的声明式语言 |
| **核心能力** | 令牌级约束 / 逻辑条件 / 变量绑定 / 高效束搜索解码 |
| **适用场景** | 研究场景；需要严格输出约束的系统 |

---

## 对齐评测与红队工具

### RAGAS — RAG 质量评估框架

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/explodinggradients/ragas（7k+ ⭐） |
| **核心指标** | Faithfulness（忠实度）/ Answer Relevancy（回答相关性）/ Context Precision（上下文精确度） |
| **使用方式** | 无需人工标注；基于 LLM 自动化评估 |

### BBQ — 偏置基准测试

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/nyu-mll/jiant/tree/main/probing/data/bbq |
| **定位** | 问答系统中的社会偏置评测 |
| **维度** | 性别 / 种族 / 年龄 / 宗教等敏感属性 |

### TruthfulQA — 真实性评测

| 维度 | 详情 |
|------|------|
| **来源** | https://github.com/sylinrl/TruthfulQA |
| **核心指标** | 回答真实性 vs 回答信息量（Truth vs Infomativeness） |
| **用途** | 评测 LLM 是否会自信地传播错误信息 |

### Red Teaming 工具

| 工具 | 机构 | GitHub | 用途 |
|------|------|--------|------|
| **Garak** | NVIDIA | https://github.com/NVIDIA/garak | LLM 漏洞扫描（幻觉、提示注入、DAN 等） |
| **AutoJailbreak** | 社区 | https://github.com/PrincetonSNAutoJailbreak | 自动化越狱攻击生成与评测 |
| **IBM Safety Prompts** | IBM | https://github.com/IBM/safety-prompts | 企业级 Prompt 安全分类标准 |

---

## 集成架构建议

```
用户输入
    │
    ▼
┌─────────────────┐
│  输入 Guardrails  │ ← NeMo / Guardrails AI
│  (内容检测+过滤) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   LLM 推理引擎  │ ← vLLM / Ollama / API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  输出 Guardrails │ ← NeMo / Outlines / Guidance
│  (结构化+安全)   │
└────────┬────────┘
         │
         ▼
  用户安全输出
```

---

## 2026 年安全趋势

1. **Guardrails 即标准**：安全护栏从"可选"变为生产部署的"必须"，类似 Web 安全中的 WAF
2. **多模态安全**：视觉语言模型（VLM）的图像输入安全检测成为新挑战
3. **可解释性工具崛起**：不仅告诉用户"不安全"，还要解释"为什么不安全"
4. **合规自动化**：AI Act（欧盟）、生成式人工智能管理办法（中国）催生合规即代码工具
