---
title: "Embedding 模型与向量数据库全栈指南"
description: "从文本 Embedding 模型选型到向量数据库部署的完整技术栈，覆盖 2025-2026 年主流方案。"
url: "https://github.com/milvus-io/milvus"
tags: ["Embedding", "Vector DB", "Milvus", "Qdrant", "Pinecone", "Weaviate", "Chroma", "pgvector"]
contributor: "@zhima"
recommendation: 5
cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
---

## Embedding 模型选型（2025-2026）

### 开源 Embedding 模型推荐

| 模型 | 参数量 | 维度 | 特点 | GitHub |
|------|--------|------|------|--------|
| **BGE-M3**（智源） | 多规模 | 1024 | 中英双语最强，多语言统一 | https://github.com/FlagOpen/FlagEmbedding |
| **GTE**（阿里） | 多规模 | 768/1024 | 中文优化，开源可商用 | https://github.com/z Entitlement/gte |
| **NV-Embed-QA**（NVIDIA） | 7.8B | 4096 | 长文本检索 SOTA | Hugging Face 独占 |
| **Voyage-3** | - | 1024 | 闭源，RAG 评测领先 | 商业服务 |

> **选型建议**：中文场景优先 BGE-M3 / GTE；英文通用场景用 Voyage-3（闭源）或 Nomic Embed（开源可平替）。

### Embedding API 服务

| 服务商 | 模型 | 特点 |
|--------|------|------|
| **OpenAI** | text-embedding-3-large（3072 维） | 闭源，按 Token 计费 |
| **Cohere** | embed-english-v3.0 / embed-multilingual | 多语言+稠密向量，API 友好 |
| **Mistral** | mistral-embed | 性价比高，欧盟合规 |
| **Azure OpenAI** | 同 OpenAI | 企业合规，数据不外流 |

---

## 向量数据库完整对比（2025-2026）

### 六强概览

| 数据库 | 语言 | 开源 | 适合规模 | 索引算法 |
|--------|------|------|---------|---------|
| **Chroma** | Python | ✅ Apache 2.0 | <100万向量 | HNSW |
| **pgvector** | C | ✅ PostgreSQL | <1000万 | HNSW / IVFFlat |
| **Qdrant** | Rust | ✅ Apache 2.0 | 10亿+ | HNSW + 磁盘向量 |
| **Milvus** | Go+C++ | ✅ Apache 2.0 | **100亿+** | HNSW / IVF / DiskANN |
| **Weaviate** | Go | ✅ BSD-3 | ~1亿 | HNSW |
| **Pinecone** | 专有 | ❌ SaaS | 10亿+ | 内部优化 |

### 性能数据（1M 向量 / 768d 规模）

| 指标 | Chroma | pgvector | Qdrant | Milvus | Weaviate | Pinecone |
|------|--------|----------|--------|--------|----------|----------|
| 查询延迟(p99) | ~15ms | ~20ms | **~5ms** | **~5ms** | ~10ms | ~10ms |
| 并发 QPS | ~500 | ~800 | ~3,000 | **~5,000+** | ~1,500 | ~1,000+ |
| 每百万向量内存 | ~3.5GB | ~3GB | **~2.5GB** | ~3GB | ~4GB | 托管 |
| 磁盘向量支持 | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |

---

## 深度解析：各数据库适用场景

### Chroma — 原型与实验首选

```
pip install chromadb
```
- **核心优势**：零配置、进程内运行、可在 Jupyter 直接使用
- **典型用法**：LangChain / LlamaIndex 快速 RAG 原型
- **局限**：生产环境水平扩展能力有限
- **生产升级路径**：Chroma → Qdrant / pgvector

### pgvector — 已有 PostgreSQL 基础设施首选

- **核心优势**：无需新基础设施；SQL JOIN + ACID 事务；完整 SQL 能力
- **适用场景**：已有 PostgreSQL 的团队，向量规模 <1000 万
- **典型用法**：用户画像 + 向量混合查询（单 SQL 完成）
- **生产注意**：合理配置 `hnsw.build_parameters`（m/ef_construction）

### Qdrant — 高性能+复杂过滤场景

- **核心优势**：Rust 语言高性能；高效 payload 过滤；**mmap 磁盘向量**（内存占用极低）
- **适用场景**：需要复杂 metadata 过滤的生产 RAG；边缘/内存受限部署
- **典型用法**：电商商品多属性过滤 + 向量相似搜索
- **亮点功能**：`recommend()` API、正则过滤、分组搜索

### Milvus — 超大规模生产环境

- **核心优势**：**唯一支持 100 亿+向量**；GPU 加速；最丰富的索引类型（DiskANN）
- **适用场景**：亿级向量检索；多模态检索（文本+图像+视频）；需要 GPU 加速推理
- **典型用法**：搜索引擎内容索引；视频帧向量库；多租户 SaaS 向量服务
- **组件架构**：Root Coord / Query Coord / Data Coord / Index Coord（生产需多节点）

### Weaviate — 混合搜索（关键词+向量）

- **核心优势**：**原生 BM25 + 向量混合搜索**；内置向量化模块（无需外部 Embedding 服务）
- **适用场景**：需要同时做关键词匹配和语义相似度排序的场景
- **典型用法**：法律/医疗文档检索（精确法律条款匹配 + 语义相关扩展）
- **注意**：内存消耗较高，1 亿向量建议 64GB+ 内存

### Pinecone — 零运维全托管

- **核心优势**：零运维；自动扩缩容；多区域部署
- **适用场景**：不想运维基础设施的团队；快速上线；初创公司
- **局限**：无自托管选项，存在供应商锁定风险
- **成本参考**：Serverless 按用量计费；起步价约 $25/月

---

## 选型决策流程

```
第一步：问自己三个问题
│
├─ "向量规模多大？"
│   ├─ < 100万 → Chroma（原型）或 pgvector（生产）
│   ├─ 100万 ~ 1亿 → Qdrant（高性能）或 Weaviate（混合搜索）
│   └─ 1亿+ → Milvus（分布式）或 Pinecone（托管）
│
├─ "有没有现有 PostgreSQL？"
│   └─ 有 → 优先 pgvector（零新基建成本）
│
└─ "要不要自托管？"
    ├─ 要 → Qdrant / Milvus / Weaviate / pgvector
    └─ 不要 → Pinecone / Zilliz Cloud（Milvus 托管版）
```

---

## Embedding + 向量数据库集成示例

### LangChain 组合（最常用）

```python
# LangChain + Qdrant 示例
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_qdrant import QdrantVectorStore

# 中文 Embedding
embeddings = HuggingFaceBgeEmbeddings(
    model_name="BAAI/bge-m3",
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True}
)

# 连接到 Qdrant
vectorstore = QdrantVectorStore.from_existing_collection(
    embedding=embeddings,
    collection_name="my_rag",
    url="http://localhost:6333"
)

# 检索
docs = vectorstore.similarity_search("大模型微调技巧", k=5)
```

### LlamaIndex 组合（检索更专业）

```python
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.core import VectorStoreIndex

# LlamaIndex 支持 Milvus / Qdrant / Chroma / Weaviate / Pinecone
vector_store = QdrantVectorStore(collection_name="llamaindex_rag")
index = VectorStoreIndex.from_vector_store(vector_store)
```

---

## 2026 年新趋势

1. **DiskANN 普及**：Milvus 和 Qdrant 均支持 DiskANN，大幅降低内存依赖
2. **多向量字段**：Qdrant / Milvus 支持同一文档多个向量（多模态 RAG）
3. **混合搜索标准化**：向量 + BM25 + RRF 融合成为 RAG 标配
4. **向量数据库即服务下沉**：各云厂商（AWS、阿里云、腾讯云）纷纷推出向量数据库托管服务
