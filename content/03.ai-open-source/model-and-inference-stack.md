---
title: "模型与推理栈（Transformers / vLLM / llama.cpp / Ollama）"
description: "从模型加载到高性能推理部署的核心开源项目组合，附 2025-2026 年新进展。"
url: "https://github.com/huggingface/transformers"
tags: ["Transformers", "vLLM", "llama.cpp", "Ollama", "Inference", "Local LLM"]
contributor: "@zhima"
recommendation: 5
cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80"
---

## 全景对比

| 项目 | GitHub | Stars | 语言 | 核心优势 | 典型场景 |
|------|--------|-------|------|---------|---------|
| **Transformers** | huggingface/transformers | 58k+ | Python | 生态最全，支持 100+ 模型 | 研究 / 原型 / 微调 |
| **vLLM** | vllm-project/vllm | 80k+ | Python+C++ | PagedAttention 高吞吐 | 生产服务端推理 |
| **llama.cpp** | ggerganov/llama.cpp | 70k+ | C/C++ | 纯 CPU/GPU，无依赖 | 本地 / 嵌入式 / 苹果芯片 |
| **Ollama** | ollama/ollama | 100k+ | Go | 一键运行，跨平台 | 本地 LLM 零配置体验 |
| **Jan** | janhq/jan | 15k+ | TypeScript | 本地 ChatGPT 替代，GUI | 本地 AI 日常使用 |

## 深度解析

### Transformers — 研究与微调的瑞士军刀

- **定位**：Hugging Face 生态核心，研究与微调的通用入口
- **核心能力**：100+ 预训练模型架构；Pipeline 抽象；Trainer API；Tokenizers
- **2025-2026 新进展**：Flash Attention 3 集成；FSDP 分布式训练；4-bit 量化原生支持
- **选型建议**：几乎所有 LLM 研究项目的起点，配合 PEFT（LoRA/QLoRA）使用

### vLLM — 生产级高吞吐推理引擎

- **定位**：服务端 LLM 推理的事实标准（SOTA）
- **核心突破**：**PagedAttention** — 将 KV Cache 分页管理，显存利用率提升 2-4 倍
- **2025-2026 新进展**：
  - PagedAttention v2 + FlashAttention 3 深度集成
  - Speculative Decoding（推测解码）大幅降低延迟
  - Multi-LoRA 动态加载
  - 支持 Tensor 并行（多卡）
- **性能数据**：A100 80GB 单卡可达 2000+ tokens/s（Llama 3 70B，batch=16）
- **生产使用**：搭配 Ray Serve 或 Kubernetes 实现弹性扩缩容

### llama.cpp — 无依赖本地推理之王

- **定位**：纯 C/C++ 实现，零外部依赖，任意平台编译运行
- **核心优势**：
  - 苹果 M 系列芯片原生支持（GPU 加速）
  - 纯 CPU 推理（无独显也能跑 7B 模型）
  - GGUF 量化格式（Q2_K / Q4_K / Q5_K / Q8_0）
  - 嵌入式友好（树莓派/手机端均可）
- **量化等级建议**：
  - **Q8_0**：接近 FP16 精度，显存减半
  - **Q4_K_M**：精度/大小平衡，推荐首选
  - **Q2_K**：最小体积，4GB 可跑 70B，适合极度受限环境
- **典型用法**：`llama-cli` 命令行推理 / `llama-server` HTTP 服务

### Ollama — 本地 LLM 零配置体验

- **定位**：让"运行本地大模型"变得像"打开 App"一样简单
- **使用方式**：
  ```bash
  ollama run llama3          # 一行命令运行 Llama 3
  ollama run mistral         # 运行 Mistral
  ollama run deepseek-r1     # 运行 DeepSeek
  ollama run qwen2.5         # 运行通义千问
  ```
- **2025-2026 更新**：原生支持多模态模型（Llava）；API 服务模式；Modelfile 自定义配置
- **API 兼容**：提供 OpenAI-compatible API，直接替换 `OPENAI_API_BASE` 即可

## 推理部署决策树

```
推理需求
│
├─ "研究 / 微调 / 原型"
│   └─ → Hugging Face Transformers + PEFT（LoRA/QLoRA）
│
├─ "服务端高并发（100+ QPS）"
│   └─ → vLLM（配合 Ray 或 Kubernetes）
│
├─ "本地日常使用（苹果芯片/无独显）"
│   └─ → Ollama（最简单）或 llama.cpp（最高性能）
│
├─ "嵌入式 / 极度受限环境"
│   └─ → llama.cpp + GGUF Q4/Q2 量化
│
└─ "本地 GUI 体验（类 ChatGPT 界面）"
    └─ → Jan（开源，跨平台，可离线）
```

## 量化格式一览（llama.cpp GGUF）

| 格式 | 精度 | 70B 模型大小 | 适用场景 |
|------|------|------------|---------|
| **FP16** | 16bit | ~140GB | 基线参考 |
| **Q8_0** | 8bit | ~70GB | 高精度量化首选 |
| **Q5_K_M** | ~5bit | ~50GB | 推荐日常使用 |
| **Q4_K_M** | ~4bit | ~40GB | 平衡之选 |
| **Q3_K_M** | ~3bit | ~30GB | 极限压缩 |
| **Q2_K** | ~2bit | ~20GB | 最小体积 |
