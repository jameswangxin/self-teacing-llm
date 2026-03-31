import { CourseModuleSchema } from '../schema';

export const stage6Modules = CourseModuleSchema.array().parse([
  {
    id: '6.1',
    number: '6.1',
    title: '知识图谱 + RAG',
    slug: 'graph-rag',
    stageId: 'production-ai-systems',
    summary: '把实体、关系和三元组引入检索系统，理解 GraphRAG 何时比纯向量检索更适合复杂知识连接问题。',
    estimatedTime: '40 分钟',
    prerequisites: ['2.7', '3.2', '5.4'],
    keyPoints: [
      '掌握实体、关系、三元组和图查询在知识表达上的基本角色',
      '理解 GraphRAG 如何把图遍历与语义检索组合成可解释的检索架构',
      '学会从非结构化文本中抽取实体关系并自动化构建知识图谱',
      '认识 Neo4j 在图存储、查询和应用集成中的基础位置'
    ]
  },
  {
    id: '6.2',
    number: '6.2',
    title: '多模态 RAG',
    slug: 'multimodal-rag',
    stageId: 'production-ai-systems',
    summary: '理解图片、表格和复杂文档为什么让传统文本 RAG 失效，并学会设计多模态检索链路。',
    estimatedTime: '40 分钟',
    prerequisites: ['2.4', '2.7', '3.5'],
    keyPoints: [
      '识别图片、表格、扫描件和复杂 PDF 在解析与索引上的主要难点',
      '理解多模态 embedding 如何把文本、图像和版面信息映射到可检索空间',
      '掌握文档解析工具在 OCR、版面恢复和结构化抽取中的作用',
      '能够判断哪些真实业务问题必须用多模态 RAG 而不是文本降维替代'
    ]
  },
  {
    id: '6.3',
    number: '6.3',
    title: 'Context Engineering',
    slug: 'context-engineering',
    stageId: 'production-ai-systems',
    summary: '从“写 prompt”升级到“组装上下文”，掌握上下文来源、预算控制和动态拼装的工程方法。',
    estimatedTime: '35 分钟',
    prerequisites: ['3.5', '4.5', '5.3'],
    keyPoints: [
      '理解 Prompt Engineering 与 Context Engineering 在关注对象上的根本差异',
      '掌握系统指令、用户输入、记忆状态和外部检索四类上下文来源',
      '学会上下文预算分配、裁剪和优先级排序的方法',
      '理解动态上下文组装如何让同一个系统对不同任务走不同信息路径'
    ]
  },
  {
    id: '6.4',
    number: '6.4',
    title: '可观测性与调试',
    slug: 'observability-and-debugging',
    stageId: 'production-ai-systems',
    summary: '把 tracing、evaluation 和 monitoring 变成日常工程基础设施，而不是出事故后才补上的诊断工具。',
    estimatedTime: '35 分钟',
    prerequisites: ['3.7', '4.6', '5.3'],
    keyPoints: [
      '区分 tracing、evaluation、monitoring 分别回答什么问题',
      '理解 LangSmith 与 Langfuse 在追踪、评估和团队协作上的典型定位',
      '掌握从用户投诉回放到根因定位的 Agent 调试路径',
      '建立指标、日志、样本和回归评估协同工作的观测闭环'
    ]
  },
  {
    id: '6.5',
    number: '6.5',
    title: '性能与成本优化',
    slug: 'performance-and-cost-optimization',
    stageId: 'production-ai-systems',
    summary: '系统化处理延迟、吞吐和费用约束，建立缓存、路由、批处理与部署选择的优化框架。',
    estimatedTime: '40 分钟',
    prerequisites: ['2.2', '3.7', '4.6'],
    keyPoints: [
      '区分 embedding cache、semantic cache 与 LLM 响应缓存的命中条件和风险',
      '掌握 token 预算、异步执行和批处理对性能与费用的影响',
      '理解大小模型路由如何在质量、成本和延迟之间做分层决策',
      '认识 Ollama 与 vLLM 这类本地部署方案在隐私、吞吐和运维上的取舍'
    ]
  },
  {
    id: '6.6',
    number: '6.6',
    title: '安全与合规',
    slug: 'safety-and-compliance',
    stageId: 'production-ai-systems',
    summary: '理解生产级 AI 系统的主要攻击面和合规压力，建立输入、过程、输出和审计的多层防护意识。',
    estimatedTime: '35 分钟',
    prerequisites: ['4.3', '5.6'],
    keyPoints: [
      '识别 prompt injection、越权工具调用和上下文污染的常见路径',
      '理解数据隐私、最小权限和敏感信息泄漏在系统设计中的要求',
      '掌握输出安全审核、策略拦截与人工兜底的分层方法',
      '认识审计日志为什么是复盘、问责和合规证明的基础'
    ]
  },
  {
    id: '6.7',
    number: '6.7',
    title: '综合实战项目',
    slug: 'production-capstone',
    stageId: 'production-ai-systems',
    summary: '把前五个阶段和 Stage 6 的生产实践整合成一个完整项目，训练从架构选择到上线约束的全链路判断。',
    estimatedTime: '45 分钟',
    prerequisites: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6'],
    keyPoints: [
      '理解团队知识库、代码库助手、内容审核和数据分析助手等项目方向的差异',
      '学会把检索、Agent、上下文工程、可观测性和安全护栏整合为完整系统',
      '掌握从需求边界、评估方法到上线策略的项目规划框架',
      '建立“先做最小可运行版本，再逐层补齐生产能力”的落地顺序'
    ]
  }
]);
