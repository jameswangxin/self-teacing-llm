import { CourseModuleSchema } from '../schema';

export const stage2Modules = CourseModuleSchema.array().parse([
  {
    id: '2.1',
    number: '2.1',
    title: '为什么需要 RAG',
    slug: 'why-rag',
    stageId: 'rag-fundamentals',
    summary: '从 LLM 的固有短板出发，建立“检索增强生成”为什么必要以及何时优先于微调的判断框架。',
    estimatedTime: '25 分钟',
    prerequisites: ['1.1', '1.7'],
    keyPoints: [
      '识别知识过时、幻觉和缺乏私域知识这三类典型问题',
      '用“开卷考试”直觉理解检索增强生成的完整思路',
      '区分 RAG 与微调在成本、更新速度和作用对象上的差异',
      '理解企业知识库、客服系统、文档问答和代码助手为何适合 RAG'
    ]
  },
  {
    id: '2.2',
    number: '2.2',
    title: 'Embedding 原理',
    slug: 'embedding-fundamentals',
    stageId: 'rag-fundamentals',
    summary: '理解文本嵌入如何把语义映射为向量空间，并建立模型选型与局限性判断。',
    estimatedTime: '30 分钟',
    prerequisites: ['2.1'],
    keyPoints: [
      '理解 Embedding 是把文本压缩成可比较的高维语义向量',
      '掌握语义空间中“距离近代表意思接近”的基本直觉',
      '比较 OpenAI、BGE 和 Cohere 等嵌入模型的选型维度',
      '认识同义词混淆、跨语言差异和领域偏差等限制'
    ]
  },
  {
    id: '2.3',
    number: '2.3',
    title: '语义相似度计算',
    slug: 'semantic-similarity',
    stageId: 'rag-fundamentals',
    summary: '建立余弦相似度、欧氏距离和点积的直觉，理解相似度指标如何影响检索排序。',
    estimatedTime: '25 分钟',
    prerequisites: ['2.2'],
    keyPoints: [
      '区分向量夹角、绝对距离和长度加权这三种比较方式',
      '理解余弦相似度为何常用于文本语义检索',
      '认识向量是否归一化会改变点积与欧氏距离的含义',
      '通过改写和释义样本观察相似度的实际波动'
    ]
  },
  {
    id: '2.4',
    number: '2.4',
    title: '文档加载与预处理',
    slug: 'document-loading-and-preprocessing',
    stageId: 'rag-fundamentals',
    summary: '把原始资料整理成可检索语料，覆盖加载、清洗、归一化、分段与元数据标注。',
    estimatedTime: '30 分钟',
    prerequisites: ['2.1'],
    keyPoints: [
      '理解 PDF、Markdown、网页和数据库等不同来源的加载特点',
      '掌握去噪、格式统一和段落切分对检索质量的影响',
      '学会用来源、时间、类型等元数据增强后续过滤能力',
      '建立“垃圾进垃圾出”的预处理质量意识'
    ]
  },
  {
    id: '2.5',
    number: '2.5',
    title: 'Chunking 分块策略',
    slug: 'chunking-strategies',
    stageId: 'rag-fundamentals',
    summary: '掌握为什么要切块，以及固定分块、递归分割、语义分块和结构化分块的适用边界。',
    estimatedTime: '30 分钟',
    prerequisites: ['2.4'],
    keyPoints: [
      '理解分块是在召回率、精度和上下文成本之间做权衡',
      '掌握固定大小、递归字符、语义和结构感知分块的思路',
      '理解 chunk size 与 overlap 会同时影响检索命中和冗余',
      '能够根据文档类型选择更合适的切分策略'
    ]
  },
  {
    id: '2.6',
    number: '2.6',
    title: '向量数据库',
    slug: 'vector-stores',
    stageId: 'rag-fundamentals',
    summary: '从存储与索引层面理解向量数据库，建立工具选型和近似最近邻算法的基本直觉。',
    estimatedTime: '35 分钟',
    prerequisites: ['2.2', '2.3'],
    keyPoints: [
      '区分向量数据库、关系数据库和全文搜索引擎的职责边界',
      '理解 Chroma、FAISS、Milvus、Pinecone、Qdrant、Weaviate 的定位差异',
      '用近似搜索直觉理解 HNSW 与 IVF 的基本思想',
      '掌握 Chroma 内存模式与磁盘持久化模式的使用场景'
    ]
  },
  {
    id: '2.7',
    number: '2.7',
    title: '基础 RAG Pipeline 搭建',
    slug: 'basic-rag-pipeline',
    stageId: 'rag-fundamentals',
    summary: '把前面所有环节串成可运行的基础 RAG 链路，并为个人文档问答助手项目建立实现蓝图。',
    estimatedTime: '40 分钟',
    prerequisites: ['2.4', '2.5', '2.6'],
    keyPoints: [
      '掌握加载、分块、嵌入、存储、检索、提示增强、生成的完整链路',
      '理解 LangChain 中 Loader、Splitter、Embeddings、Retriever 等组件分工',
      '认识 Top-K、Prompt Template 和 LCEL 对最终回答质量的影响',
      '能够规划一个最小可用的个人文档问答助手'
    ]
  }
]);
