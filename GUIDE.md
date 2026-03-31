# RAG 与 Agent 学习指南 (GUIDE.md)

> **🤖 AI 导师**: 2026 AI 应用架构师
> **核心原则**: 不做调参侠，做架构师。理论 + 实战并重，每个阶段都有可运行的项目。
> **编程范式**: Spec Coding — 所有代码通过 AI 生成，学习者聚焦于架构理解与需求表达。

---

## 🗺️ 深度学习路线图

### 🟢 第一阶段：AI 工程基础 (AI Engineering Foundation)
*深度目标：建立对 LLM 的直觉认知，搭好开发环境，打通第一个 API 调用。*

- **1.1 LLM 到底是什么**
  - Transformer 架构的直觉理解（不需要数学推导，只需要知道"它怎么工作"）。
  - 预训练 vs 微调 vs 推理：三个阶段各自在做什么？
  - 开源 vs 闭源模型：GPT / Claude / DeepSeek / Llama 的定位与选型。
  - 模型的能力边界：知识截止日期、幻觉（Hallucination）、推理能力的局限。

- **1.2 Token 与上下文窗口**
  - 什么是 Token？中文和英文的 Token 计数差异。
  - 上下文窗口 (Context Window)：4K / 32K / 128K / 1M 的实际意义。
  - Token 计费模型：Input Token vs Output Token，各厂商定价对比。
  - 上下文窗口的"注意力衰减"问题：越长的上下文，中间部分越容易被忽略。

- **1.3 模型参数与行为控制**
  - Temperature：确定性回答（0）vs 创造性回答（1）之间的光谱。
  - Top-P (Nucleus Sampling)：与 Temperature 的区别和配合使用。
  - Max Tokens：控制输出长度。
  - Stop Sequences：控制输出终止条件。
  - 实验：同一个 Prompt，不同参数下的输出差异对比。

- **1.4 Prompt Engineering 基础**
  - 三种角色：System Prompt / User Prompt / Assistant 的分工与组合。
  - Zero-shot vs Few-shot：不给例子 vs 给几个例子的效果差异。
  - 指令清晰度：模糊指令 vs 精确指令的对比实验。
  - 输出格式控制：让 LLM 按 JSON / Markdown / XML 结构化返回。
  - Prompt 调试方法论：当输出不符合预期时，如何系统性调优。

- **1.5 Prompt Engineering 进阶**
  - Chain of Thought (CoT)：让 LLM "一步步想"来提高推理准确率。
  - Self-Consistency：多次采样取多数，减少推理随机性。
  - Role Prompting：赋予 LLM 专业角色以获得更好的领域输出。
  - Prompt Chaining：将复杂任务拆解为多个串联的简单 Prompt。
  - 反面教材：常见的 Prompt 错误模式与修正方法。

- **1.6 开发环境搭建**
  - Python 环境管理：uv / venv 的安装与使用。
  - 项目结构规范：标准的 AI 项目目录布局。
  - 依赖管理：`pyproject.toml` / `requirements.txt` 的最佳实践。
  - Jupyter Notebook：交互式实验环境的使用技巧。
  - API Key 安全管理：环境变量、`.env` 文件、`python-dotenv` 的使用。

- **1.7 LLM API 调用实战**
  - OpenAI API：Chat Completions 端点的完整参数解析。
  - 流式响应 (Streaming)：Server-Sent Events 的处理方式。
  - 多模型调用：Claude / DeepSeek API 的接入差异。
  - 错误处理：Rate Limit、Token Limit、网络超时的应对策略。
  - 重试机制与指数退避 (Exponential Backoff)。
  - 🔧 **实战项目**: 构建一个支持多模型切换的命令行 AI 聊天助手，支持流式输出和对话历史。

---

### 🔵 第二阶段：RAG 核心原理 (RAG Fundamentals)
*深度目标：理解"检索增强生成"的完整数据流，搭建并理解每一个环节。*

- **2.1 为什么需要 RAG**
  - LLM 的三大痛点：知识过时、幻觉、缺乏私域知识。
  - RAG 的核心思想：让 LLM "开卷考试"而不是"闭卷考试"。
  - RAG vs 微调 (Fine-tuning)：什么时候用哪个？各自的成本与效果对比。
  - RAG 的典型应用场景：企业知识库、客服系统、文档问答、代码助手。

- **2.2 Embedding 原理**
  - 什么是 Embedding？文本如何变成高维数字向量？
  - 词向量的语义空间：为什么 King - Man + Woman ≈ Queen？
  - Embedding 模型的选型对比：
    - OpenAI text-embedding-3-small / 3-large
    - BGE-M3（中英文开源首选）
    - Cohere Embed v3
    - 各模型的维度、性能、成本对比。
  - Embedding 的局限性：同义词混淆、跨语言差异、领域偏差。

- **2.3 语义相似度计算**
  - 余弦相似度 (Cosine Similarity)：最常用的距离度量，直觉理解。
  - 欧氏距离 (Euclidean Distance)：与余弦相似度的区别和适用场景。
  - 点积 (Dot Product)：速度最快的近似方法。
  - 实验：用相同文本的不同表述，观察相似度变化。

- **2.4 文档加载与预处理**
  - 文档加载器 (Document Loaders)：
    - PDF 加载：PyPDF、pdfplumber、Unstructured 的对比。
    - Markdown / 纯文本加载。
    - 网页抓取：BeautifulSoup / Playwright 集成。
    - 数据库加载：从 MySQL/PostgreSQL 直接读取。
  - 文档清洗：去除噪音、格式化、分段。
  - Metadata 标注：为每个文档附加来源、时间、类型等元信息。

- **2.5 Chunking 分块策略**
  - 为什么要分块？上下文窗口限制与检索粒度的权衡。
  - 固定大小分块 (Fixed Size)：最简单，但可能切断语义。
  - 递归字符分割 (Recursive Character Splitting)：LangChain 的默认策略。
  - 语义分块 (Semantic Chunking)：基于语义边界智能切分。
  - 按文档结构分块：Markdown Header / HTML Tag / 段落边界。
  - Chunk Size 与 Overlap 的调优经验：太大 vs 太小的影响。
  - 实验：同一文档不同分块策略的检索效果对比。

- **2.6 向量数据库 (Vector Store)**
  - 向量数据库 vs 传统关系数据库 vs 全文搜索引擎的核心区别。
  - 主流向量数据库对比：
    - **Chroma**: 轻量级、内嵌式、Python 原生，适合学习和原型。
    - **FAISS**: Facebook 出品、高性能、纯内存，适合研究。
    - **Milvus**: 分布式、生产级、支持十亿级向量。
    - **Pinecone**: 全托管云服务、零运维。
    - **Qdrant**: Rust 编写、高性能、功能丰富。
    - **Weaviate**: 内置混合搜索、GraphQL 接口。
  - 索引算法的直觉理解（不需要数学推导）：
    - HNSW (Hierarchical Navigable Small World)：为什么快？
    - IVF (Inverted File Index)：先粗筛再精排的思想。
  - Chroma 实操：创建集合、存入向量、相似度检索、过滤查询。
  - 持久化存储：内存模式 vs 磁盘模式。

- **2.7 基础 RAG Pipeline 搭建**
  - 完整链路梳理：加载 → 分块 → 嵌入 → 存储 → 检索 → 增强提示 → 生成。
  - LangChain 的 RAG 组件：
    - `DocumentLoader` → `TextSplitter` → `Embeddings` → `VectorStore` → `Retriever`。
  - Prompt Template 设计：如何将检索结果注入到 LLM 提示词中。
  - 检索参数：Top-K 的选择与影响。
  - 串联整个流程：使用 LCEL (LangChain Expression Language) 构建 Chain。
  - 🔧 **实战项目**: 构建"个人文档问答助手"——上传 PDF/Markdown 文档，用自然语言提问，获取基于文档的精准回答。

---

### 🟣 第三阶段：RAG 进阶优化 (Advanced RAG)
*深度目标：从"能用"到"好用"，系统性解决真实场景中的 RAG 痛点。*

- **3.1 RAG 的常见失败模式**
  - 失败模式一：检索到了无关内容 → 召回率 (Recall) 不足。
  - 失败模式二：检索到了相关内容但答案不对 → 忠实度 (Faithfulness) 不足。
  - 失败模式三：检索到了太多内容导致 LLM 迷失 → "Lost in the Middle" 问题。
  - 失败模式四：用户提问太模糊 → 查询质量不足。
  - 针对每种失败模式对应的优化策略概览。

- **3.2 混合检索 (Hybrid Search)**
  - 向量搜索的短板：对精确关键词（如产品型号、人名）匹配弱。
  - BM25 关键词搜索回顾：TF-IDF 的进化版，擅长精确匹配。
  - Hybrid Search 原理：向量搜索 + 关键词搜索的加权融合。
  - 融合策略：Reciprocal Rank Fusion (RRF) 的工作方式。
  - 实现方式：LangChain 的 `EnsembleRetriever`。
  - 实验：纯向量 vs 纯 BM25 vs 混合检索的效果对比。

- **3.3 查询优化 (Query Transformation)**
  - 查询重写 (Query Rewriting)：用 LLM 将用户的口语化提问改写为更适合检索的形式。
  - Multi-Query 多角度检索：用 LLM 从多个角度重述问题，合并检索结果。
  - HyDE (Hypothetical Document Embedding)：先让 LLM 生成一个"假答案"，用假答案的向量去检索。
  - Step-Back Prompting：先抽象问题再回答，适合需要推理的复杂问题。
  - Query Decomposition：将复合问题拆解为多个子问题分别检索。
  - 各策略的适用场景与组合方案。

- **3.4 Reranking 重排序**
  - 为什么 Top-K 检索结果需要二次排序？
  - Bi-Encoder vs Cross-Encoder：
    - Bi-Encoder（初筛）：速度快，独立编码 Query 和 Document。
    - Cross-Encoder（重排）：精度高，联合编码 Query-Document 对。
  - 主流 Reranker 模型：Cohere Reranker、BGE-Reranker、FlashRank。
  - "Lost in the Middle" 问题的详细分析与 Reranking 解决方案。
  - 实现方式：LangChain 的 `ContextualCompressionRetriever` + Reranker。

- **3.5 上下文管理与压缩**
  - Contextual Compression：用 LLM 压缩检索结果，提取关键信息。
  - Parent-Child 索引策略：
    - 小块用于检索（精准匹配）。
    - 大块用于生成（完整上下文）。
    - 实现方式：LangChain 的 `ParentDocumentRetriever`。
  - Metadata 过滤：按时间、来源、文档类型缩小检索范围。
  - 动态 Top-K：根据查询复杂度自动调整检索数量。

- **3.6 多轮对话 RAG**
  - 对话历史管理：如何在多轮对话中保持上下文连贯。
  - 历史感知检索 (History-Aware Retrieval)：将对话历史融入检索查询。
  - 对话摘要自动生成：防止历史过长导致 Token 超限。
  - Conversational RAG Chain 的完整实现。

- **3.7 RAG 评估体系**
  - 为什么评估很重要？"不能度量就不能改进"。
  - 三大核心指标详解：
    - **Context Relevance**: 检索到的上下文与问题相关吗？
    - **Faithfulness (忠实度)**: 答案是基于检索内容生成的吗？还是 LLM 在编？
    - **Answer Relevance**: 最终答案回答了用户的问题吗？
  - 评估框架实操：
    - RAGAS：自动化 RAG 评估框架。
    - DeepEval：另一个流行的评估选项。
  - 构建评估数据集：手动标注 + LLM 辅助生成。
  - 端到端评估流水线：自动化的回归测试。
  - 🔧 **实战项目**: 在第二阶段的文档问答助手基础上，引入混合检索 + Reranking + 多轮对话 + 评估指标，打造一个生产级 RAG 系统。

---

### 🟠 第四阶段：Agent 核心原理 (Agent Fundamentals)
*深度目标：理解 Agent 的"感知-推理-行动"循环，掌握工具调用和记忆机制。*

- **4.1 从 LLM 到 Agent：范式跃迁**
  - 纯 LLM 对话 vs Agent 的本质区别。
  - Agent 四要素模型：LLM（大脑）+ Tools（四肢）+ Memory（记忆）+ Planning（规划）。
  - Agent 的"自主性"光谱：从纯指令执行到完全自主。
  - Agent 的典型应用场景：个人助理、数据分析、自动化运维、研究助手。

- **4.2 ReAct 模式详解 (Reasoning + Acting)**
  - ReAct 的核心思想：思考 → 行动 → 观察，循环往复。
  - ReAct Prompt 结构解析：Thought / Action / Observation 的格式规约。
  - Agent 的决策过程：什么时候用工具？什么时候直接回答？
  - ReAct 的局限性：线性推理、无法回溯、容易陷入循环。
  - 与其他推理模式的对比：ReAct vs Plan-and-Execute vs Reflexion。

- **4.3 Function Calling 机制**
  - OpenAI Function Calling 协议详解：函数定义 → 模型决策 → 执行 → 返回。
  - Function Schema 的编写规范：`name`、`description`、`parameters` 的设计要点。
  - 并行调用 (Parallel Function Calling)：一次让 LLM 调用多个函数。
  - 强制调用 vs 自动选择：`tool_choice` 参数的使用。
  - Claude / DeepSeek 的 Tool Use 协议差异。

- **4.4 自定义工具开发 (Tool Development)**
  - LangChain 工具开发：`@tool` 装饰器与 `BaseTool` 类。
  - 工具描述 (Tool Description) 的关键性——描述写得不好，Agent 就"不会用"。
  - 常见工具类型：
    - 搜索工具：Tavily Search、Google Search。
    - 计算工具：Python REPL、Wolfram Alpha。
    - 数据库工具：SQL 查询、向量检索。
    - API 工具：REST API 调用、Webhook 触发。
    - 文件工具：读写文件、处理 CSV/Excel。
  - 工具的错误处理：工具调用失败时 Agent 的应对策略。
  - 工具结果的格式化返回：让 Agent 更好地理解工具输出。

- **4.5 Memory 系统**
  - 短期记忆 (Short-term Memory)：对话上下文管理。
    - Buffer Memory：完整保留所有对话。
    - Window Memory：滑动窗口，只保留最近 N 轮。
    - Token Buffer Memory：按 Token 数量截断。
  - 长期记忆 (Long-term Memory)：跨会话持久化。
    - 向量化记忆检索：将重要信息存入向量库。
    - 结构化记忆存储：SQLite / Redis 持久化方案。
  - 工作记忆 (Scratchpad)：Agent 执行过程中的"草稿纸"。
  - 记忆的写入与遗忘策略：什么信息该记住？什么该忘掉？

- **4.6 LangChain Agent 实战**
  - 使用 LangChain 构建带工具的 Agent 完整流程。
  - Agent Executor 的运行机制：循环调用 LLM 直到获得最终答案。
  - 调试 Agent：Verbose 模式、LangSmith 追踪、决策过程可视化。
  - Agent 的常见问题：死循环、工具误用、推理偏差的排查。
  - 🔧 **实战项目**: 构建"个人研究助理 Agent"——能搜索网络、阅读文档、查询数据库、总结信息、生成结构化报告。

---

### 🔴 第五阶段：Agent 进阶与编排 (Advanced Agent & Orchestration)
*深度目标：掌握复杂工作流编排、多 Agent 协作和新兴协议标准。*

- **5.1 为什么需要 LangGraph**
  - LangChain Agent 的局限：线性执行、难以回溯、无法表达复杂流程。
  - LangGraph 的设计哲学：用"图"来编排 AI 工作流。
  - LangChain vs LangGraph 的定位差异与配合使用方式。

- **5.2 LangGraph 核心概念**
  - 有向图 (Directed Graph)：Node（节点）、Edge（边）、State（状态）。
  - State 管理：定义图的全局状态 Schema、状态更新机制。
  - Node 类型：LLM 调用节点、工具调用节点、条件判断节点、人工审批节点。
  - Edge 类型：普通边（顺序）、条件边（分支）。
  - 图的编译与执行：`compile()` → `invoke()` / `stream()`。

- **5.3 LangGraph 高级特性**
  - 条件分支 (Conditional Edges)：根据状态动态选择下一个节点。
  - 循环 (Cycles)：Agent 的迭代推理，带终止条件。
  - 子图 (Subgraphs)：将复杂图拆分为可复用的子图。
  - 检查点 (Checkpointing)：持久化图的执行状态，支持中断与恢复。
  - 流式输出 (Streaming)：逐节点输出中间结果。
  - 错误处理与重试：节点执行失败时的恢复策略。

- **5.4 Agentic RAG**
  - Self-RAG：Agent 自我评估检索质量，不满意就重新检索。
  - Corrective RAG (CRAG)：检索结果不佳时，自动切换到网络搜索兜底。
  - Adaptive RAG：根据问题类型动态选择检索策略（本地知识 vs 网络搜索 vs 直接回答）。
  - RAG + Agent 的融合架构图解。
  - 何时用简单 RAG，何时需要 Agentic RAG？决策框架。

- **5.5 Multi-Agent 协作系统**
  - 为什么需要多个 Agent？单 Agent 的能力上限。
  - 架构模式一：**Supervisor（主管模式）**——一个 Boss Agent 分配任务给 Worker Agents。
  - 架构模式二：**Peer-to-Peer（对等协作）**——Agent 之间平等交流、共识决策。
  - 架构模式三：**Hierarchical（层级管理）**——多层管理，逐级分工。
  - 架构模式四：**Sequential（流水线）**——Agent 串联执行，每个负责一个阶段。
  - LangGraph 实现 Multi-Agent 的方式。
  - 其他框架初探：CrewAI、AutoGen 的设计理念与差异。

- **5.6 Human-in-the-Loop (人机协作)**
  - 审批节点：关键操作前等待人类确认。
  - 中断与恢复：人工介入后继续执行的机制。
  - 安全护栏 (Guardrails)：限制 Agent 的行为边界。
  - 渐进式自治：从"完全人工审核"到"部分自主"的过渡策略。
  - LangGraph 的 `interrupt()` 和 `Command` 机制。

- **5.7 MCP 协议 (Model Context Protocol)**
  - MCP 是什么？Anthropic 发起的开放标准。
  - 解决什么问题？AI 与外部工具的标准化连接——"AI 的 USB-C"。
  - MCP 架构：Host / Client / Server 三层模型。
  - MCP Server 的能力类型：Tools（工具）、Resources（资源）、Prompts（提示模板）。
  - 动态工具发现：Agent 运行时自动发现可用工具。
  - MCP 与 Function Calling 的区别与联系。
  - 已有的 MCP Server 生态：文件系统、GitHub、数据库、搜索等。
  - 自建 MCP Server 的流程概览。

- **5.8 A2A 协议 (Agent-to-Agent)**
  - A2A 是什么？Google 推出的 Agent 间通信开放标准。
  - MCP vs A2A 的定位差异：MCP 连接 Agent↔Tool，A2A 连接 Agent↔Agent。
  - A2A 的核心概念：Agent Card、Task、Message、Artifact。
  - 跨系统、跨厂商的 Agent 协作愿景。
  - A2A + MCP 的互补架构。
  - 🔧 **实战项目**: 使用 LangGraph 构建一个多步骤 Agentic RAG 工作流——自动检索知识库 → 不够就搜索网络 → 多 Agent 分析 → 人工审批 → 生成最终报告。

---

### ⚫ 第六阶段：生产级 AI 系统 (Production AI Systems)
*深度目标：将所学从"Demo"变成"产品"，关注真实世界的工程挑战。*

- **6.1 知识图谱 + RAG (GraphRAG)**
  - 为什么纯向量检索不够？关系推理的结构性缺失。
  - 知识图谱基础：实体 (Entity)、关系 (Relation)、三元组 (Triple)。
  - GraphRAG 架构：利用知识图谱增强 RAG 的上下文理解和多跳推理。
  - 自动化知识图谱构建：用 LLM 从非结构化文本中抽取实体和关系。
  - Neo4j 基础操作与 LangChain 集成。

- **6.2 多模态 RAG (Multimodal RAG)**
  - 超越纯文本：图片、表格、PDF 复杂排版的处理挑战。
  - 多模态 Embedding 模型：CLIP、Jina CLIP 等。
  - 文档解析工具：Unstructured.io、LlamaParse 的能力对比。
  - 典型场景：技术手册问答（含电路图）、合同审查（含表格）、医学报告分析（含影像）。

- **6.3 Context Engineering (上下文工程)**
  - 从 Prompt Engineering 到 Context Engineering 的演进。
  - 上下文的四个来源：用户输入 + 检索结果 + 工具输出 + 系统指令。
  - 上下文预算管理：在有限 Token 窗口内最大化信息密度。
  - 动态上下文组装：根据任务类型自动编排上下文。

- **6.4 可观测性与调试 (Observability)**
  - 为什么 AI 系统比传统系统更需要可观测性？非确定性输出的挑战。
  - LangSmith 详解：
    - Tracing：追踪每一次 LLM/Tool 调用的完整链路。
    - Evaluation：基于数据集的批量评估。
    - Monitoring：生产环境的实时监控。
  - Langfuse（开源替代）的快速上手。
  - Agent 调试方法论：当 Agent "跑偏"了怎么系统性定位问题？
  - 日志策略：结构化日志设计、关键指标埋点。

- **6.5 性能与成本优化**
  - 缓存策略：
    - Embedding 缓存：避免重复计算相同文本的向量。
    - Semantic Cache：语义相似的查询直接命中缓存。
    - LLM 响应缓存：相同 Prompt 的响应复用。
  - Token 消耗监控与预算控制。
  - 异步处理与批量 Embedding：提高吞吐量。
  - 小模型 vs 大模型的路由策略：简单问题用便宜模型，复杂问题用强模型。
  - 量化与本地部署：Ollama、vLLM 的初步了解。

- **6.6 安全与合规**
  - Prompt Injection 攻击：原理、案例与防御。
  - 数据隐私：RAG 系统中的敏感信息泄露风险。
  - 输出安全：防止 Agent 生成有害内容。
  - 审计日志：关键操作的完整记录。

- **6.7 综合实战项目**
  - 🔧 **终极项目**: 构建一个完整的生产级 AI 应用系统，整合 RAG + Agent + 多工具 + 可观测性 + 安全护栏。
  - 候选方向（根据兴趣选择一个深入实现）：
    - **A. AI 团队知识库**: 上传团队文档/Wiki，智能问答 + 自动摘要 + 权限控制。
    - **B. AI 代码库助手**: 理解你的代码仓库结构，回答架构问题、生成文档。
    - **C. AI 内容审核系统**: 多 Agent 协作审核内容（文本+图片），支持人工复审。
    - **D. AI 数据分析助手**: 连接数据库，用自然语言查询数据、生成图表和报告。
    - **E. 自定义方向**: 根据你的实际需求设计。

---

## 📝 学习方法论

### Spec Coding 工作流

```text
1. 📐 理解架构 → 看图说话，理解数据流向
2. 📝 撰写 Spec → 用自然语言精确描述需求
3. 🤖 AI 生成 → 让 Cursor/Windsurf 生成代码
4. 🔍 识谱审查 → 阅读代码，识别潜在问题
5. 🧪 运行验证 → 执行代码，验证效果
6. 🔄 迭代优化 → 根据结果调整 Spec，重新生成
```

### 每个模块的标准流程

```text
[概念讲解] → [架构图解] → [代码识谱] → [Spec 练习] → [实战项目]
```
