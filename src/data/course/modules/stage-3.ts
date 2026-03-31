import { CourseModuleSchema } from '../schema';

export const stage3Modules = CourseModuleSchema.array().parse([
  {
    id: '3.1',
    number: '3.1',
    title: 'RAG 的常见失败模式',
    slug: 'rag-failure-modes',
    stageId: 'advanced-rag',
    summary: '先学会诊断 RAG 为什么失败，再把问题映射到检索、排序、上下文和查询改写等优化杠杆。',
    estimatedTime: '30 分钟',
    prerequisites: ['2.7'],
    keyPoints: [
      '区分 recall failure、faithfulness failure、lost in the middle 和 query ambiguity 的症状',
      '理解“检索错、证据对但回答错、上下文太长、问题太模糊”分别对应哪一层优化',
      '学会先看召回结果再看答案，避免把所有问题都归咎于模型',
      '建立从失败现象到优化手段的诊断地图'
    ]
  },
  {
    id: '3.2',
    number: '3.2',
    title: '混合检索',
    slug: 'hybrid-search',
    stageId: 'advanced-rag',
    summary: '把向量检索与关键词检索组合起来，提升精确术语、数字、缩写和语义表达混杂场景下的召回质量。',
    estimatedTime: '35 分钟',
    prerequisites: ['2.3', '2.6', '2.7'],
    keyPoints: [
      '理解向量搜索在精确关键词、稀有术语和数字匹配上的短板',
      '复习 BM25 的词项频率、逆文档频率和长度归一化直觉',
      '掌握 Hybrid Search 与 RRF 融合的基本原理',
      '知道如何用 LangChain `EnsembleRetriever` 实现混合召回'
    ]
  },
  {
    id: '3.3',
    number: '3.3',
    title: '查询优化',
    slug: 'query-transformation',
    stageId: 'advanced-rag',
    summary: '把用户原始问题改写成更适合检索的查询，解决口语化、多意图和隐含背景不足的问题。',
    estimatedTime: '35 分钟',
    prerequisites: ['3.1', '3.2'],
    keyPoints: [
      '理解 Query Rewriting 为何能把用户语言转成知识库语言',
      '掌握 Multi-Query、HyDE、Step-Back 和 Decomposition 的适用边界',
      '区分“扩召回”与“拆问题”两类查询优化思路',
      '知道查询改写可能引入漂移，需要配合日志和评估观察'
    ]
  },
  {
    id: '3.4',
    number: '3.4',
    title: 'Reranking 重排序',
    slug: 'reranking',
    stageId: 'advanced-rag',
    summary: '在初筛召回之后做更精细的相关性排序，把有限上下文预算优先留给最有价值的证据。',
    estimatedTime: '35 分钟',
    prerequisites: ['3.1', '3.2'],
    keyPoints: [
      '理解为什么初始检索的相关性分数不足以直接决定最终上下文',
      '比较 bi-encoder 与 cross-encoder 在速度和精度上的取舍',
      '认识 Cohere Reranker、BGE-Reranker 和 FlashRank 的典型定位',
      '理解重排序和 `ContextualCompressionRetriever` 如何缓解 lost in the middle'
    ]
  },
  {
    id: '3.5',
    number: '3.5',
    title: '上下文管理与压缩',
    slug: 'context-management-and-compression',
    stageId: 'advanced-rag',
    summary: '学会在有限上下文窗口里装下更有效的信息，通过压缩、过滤和分层索引控制噪声与成本。',
    estimatedTime: '35 分钟',
    prerequisites: ['3.4'],
    keyPoints: [
      '掌握 Contextual Compression 的目标是删噪而不是盲目缩短',
      '理解 Parent-Child 检索如何平衡召回粒度与阅读上下文',
      '学会用 metadata filtering 缩小检索范围',
      '理解动态 Top-K 要根据查询难度和候选质量自适应调整'
    ]
  },
  {
    id: '3.6',
    number: '3.6',
    title: '多轮对话 RAG',
    slug: 'conversational-rag',
    stageId: 'advanced-rag',
    summary: '让 RAG 系统在连续对话里记住上下文、理解代词省略，并控制历史信息不要反过来污染检索。',
    estimatedTime: '35 分钟',
    prerequisites: ['3.3', '3.5'],
    keyPoints: [
      '理解多轮问答里的检索查询不能简单等于用户最后一句话',
      '掌握 history-aware retrieval 与对话摘要的配合方式',
      '知道如何在对话链中管理历史、检索和回答三个状态',
      '认识多轮上下文过长和话题漂移带来的新风险'
    ]
  },
  {
    id: '3.7',
    number: '3.7',
    title: 'RAG 评估体系',
    slug: 'rag-evaluation',
    stageId: 'advanced-rag',
    summary: '把“感觉回答不错”变成可回归的评估流程，用指标、数据集和自动化测试持续度量 RAG 质量。',
    estimatedTime: '40 分钟',
    prerequisites: ['3.1', '3.4', '3.6'],
    keyPoints: [
      '区分 context relevance、faithfulness 和 answer relevance 三类核心指标',
      '理解 RAGAS 与 DeepEval 这类框架分别如何帮助做自动评估',
      '学会构建覆盖真实问题分布的评估数据集',
      '建立每次改检索策略都要跑回归评估的工程习惯'
    ]
  }
]);
