---
title: "LLM 微调平台与工具链"
description: "从 LoRA 到 RLHF 的全谱系微调工具对比，帮助选择适合的模型定制方案。"
url: "https://github.com/hiyouga/LLaMA-Factory"
tags: ["Fine-tuning", "LoRA", "QLoRA", "RLHF", "LlamaFactory", "Axolotl", "DeepSpeed"]
contributor: "@zhima"
recommendation: 4
cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80"
---

## 微调方法全景

| 方法 | 显存需求 | 训练速度 | 效果上限 | 适用场景 |
|------|---------|---------|---------|---------|
| **Full Fine-tune** | 极高（需 A100） | 慢 | 最高 | 学术研究，数据充足 |
| **LoRA** | 中等 | 快 | 良好 | 通用场景，资源有限 |
| **QLoRA** | 低（单卡 24GB 可训 70B） | 中等 | 接近 LoRA | 个人开发者，消费级 GPU |
| **Adapter Tuning** | 低 | 快 | 良好 | 多任务切换 |
| **Prompt Tuning** | 极低 | 快 | 一般 | 只需调整风格/格式 |
| **RLHF / DPO** | 极高 | 极慢 | 最高 | 对齐、安全、特定偏好 |

---

## 微调框架对比

### LlamaFactory — 百种模型一站式微调

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/hiyouga/LLaMA-Factory（71k+ ⭐） |
| **定位** | 覆盖最广的 LLM 微调平台 |
| **支持模型** | 100+ 模型（含 Llama / Qwen / ChatGLM / Mistral / Baichuan 等） |
| **支持方法** | Full-tune / LoRA / QLoRA / RLHF（DPO / PPO）/ GRPO |
| **训练技术** | FlashAttention-2 / DeepSpeed ZeRO / Unsloth（加速优化） |
| **使用方式** | Web UI + CLI + Python API |
| **突出优势** | 模型覆盖最广；中文社区最活跃；开箱即用 |

```bash
# LlamaFactory 快速开始
llamafactory-cli train examples/train_full/qwen2_full.yaml

# LoRA 微调
llamafactory-cli train examples/train_lora/qwen2_lora.yaml
```

### Axolotl — 云原生微调框架

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/axolotl-ai-cloud/axolotl（14k+ ⭐） |
| **定位** | 专注生产级微调，支持多云训练 |
| **核心特点** | YAML 配置驱动；AWS / Lambda Labs / Modal 无缝集成；多节点训练 |
| **支持方法** | LoRA / QLoRA / Full / ReLoRA |
| **适用场景** | 有多卡/多节点资源，需要大规模训练的用户 |

### DeepSpeed-Chat — RLHF 训练完整管线

| 维度 | 详情 |
|------|------|
| **GitHub** | https://github.com/microsoft/DeepSpeedExamples（43k+ ⭐） |
| **定位** | 微软 RLHF 全链路最佳实践 |
| **三阶段** | SFT（监督微调）→ RM（奖励模型）→ RLHF（PPO） |
| **加速技术** | ZeRO-3 / 混合精度 / 流水线并行 |
| **适用场景** | 需要完整 RLHF 流程，而非仅 LoRA 的团队 |

---

## 云端微调平台

### 托管服务（无需 GPU）

| 平台 | 特点 | 起步价 | 适合场景 |
|------|------|--------|---------|
| **Replicate** | 开源模型一键微调 | 按秒计费 | 快速验证，无需基础设施 |
| **Anyscale** | Ray + 开源模型 | 按需 | 规模化训练 |
| **Modal** | Serverless GPU | 按需 | 临时训练任务 |
| **AWS SageMaker** | 企业级 | 较高 | 企业合规需求 |

### 开源自托管

| 平台 | 特点 | GitHub |
|------|------|--------|
| **OpenWebUI** | Web UI + 微调支持 | https://github.com/open-webui/open-webui |
| **Text Generation WebUI** | 经典 Web UI + LoRA 管理 | https://github.com/oobabooga/text-generation-webui |
| **mlc-llm** | 端侧 LLM 部署 | https://github.com/mlc-ai/mlc-llm |

---

## 数据准备工具

### 数据集格式（通用标准）

| 格式 | 适用场景 | 工具 |
|------|---------|------|
| **ShareGPT**（JSONL） | 对话数据 | https://huggingface.co/datasets/anon8231489123/ShareGPT_Vicuna_unfiltered |
| **Alpaca**（JSONL） | 指令微调 | https://github.com/gururise/AlpacaDataCollect |
| **UltraChat**（多轮） | 多轮对话 | https://huggingface.co/datasets/stingning/ultrachat |
| **BelleGroup**（中文） | 中文指令 | https://huggingface.co/datasets/BelleGroup |

### 数据处理工具

| 工具 | GitHub | 用途 |
|------|--------|------|
| **Distilabel** | https://github.com/argilla-io/distilabel | AI 生成训练数据 + 质量评分 |
| **Auto-CoT** | https://github.com/amazon-science/auto-cot | 自动化思维链数据生成 |
| **AlpacaEval** | https://github.com/tatsu-lab/alpaca_eval | 自动评测微调模型质量 |

---

## 显存估算与硬件推荐

### 不同规模模型的 LoRA 显存需求

| 模型规模 | FP16 全参 | FP16 LoRA | INT8 LoRA | INT4 LoRA |
|---------|----------|-----------|-----------|-----------|
| 7B | ~14GB | ~6GB | ~4GB | ~3GB |
| 13B | ~26GB | ~8GB | ~5GB | ~4GB |
| 70B | ~140GB | ~24GB | ~16GB | ~12GB |

### 硬件推荐

| 预算 | 推荐配置 | 可训规模 |
|------|---------|---------|
| 个人（<¥5000） | RTX 4090 24GB × 1 | 7B 全参 / 13B LoRA |
| 进阶（¥1-3万） | RTX 3090 24GB × 2 或 A6000 48GB | 13B 全参 / 70B QLoRA |
| 研究团队 | A100 80GB × 2+ | 70B 全参 / 100B+ LoRA |
| 企业级 | 8×A100 80GB 节点 | 任意规模 |

---

## 2026 年微调趋势

1. **QLoRA 全面普及**：单卡 24GB 可训 70B 模型，降低定制门槛
2. **GRPO 取代部分 PPO**：DeepSeek 等证明 GRPO 在数学/推理任务上效率更高，代码更简
3. **DPO 超越 PPO**：直接偏好优化（DPO）因无需单独训练 Reward Model，成为对齐首选
4. **数据质量 > 数据数量**：1k 条高质量 SFT 数据 > 100k 条低质量数据已成共识
5. **微调即服务下沉**：各大云厂商（阿里云、百度智能云、AWS）推出托管 LoRA 服务
