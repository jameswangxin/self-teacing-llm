import { CourseStageSchema } from './schema';

export const stages = CourseStageSchema.array().parse([
  {
    id: 'ai-engineering-foundation',
    number: '1',
    title: 'AI 工程基础',
    slug: 'ai-engineering-foundation',
    goal: '建立对 LLM 的直觉认知并完成第一次 API 调用。',
    summary: '从模型基础、Prompt 到开发环境与 API 实战。',
    project: '构建一个支持多模型切换的命令行 AI 聊天助手。',
    moduleIds: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7']
  },
  {
    id: 'rag-fundamentals',
    number: '2',
    title: 'RAG 核心原理',
    slug: 'rag-fundamentals',
    goal: '理解“检索增强生成”的完整数据流，搭建并理解每一个环节。',
    summary: '从 Embedding、相似度、分块到向量库与基础 RAG Pipeline。',
    project: '构建“个人文档问答助手”，基于上传文档提供精准回答。',
    moduleIds: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7']
  },
  {
    id: 'advanced-rag',
    number: '3',
    title: 'RAG 进阶优化',
    slug: 'advanced-rag',
    goal: '从“能用”到“好用”，系统性解决真实场景中的 RAG 痛点。',
    summary: '围绕检索、重排、上下文压缩、多轮对话与评估做系统优化。',
    project: '打造一个引入混合检索、重排序、多轮对话和评估指标的生产级 RAG 系统。',
    moduleIds: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7']
  },
  {
    id: 'agent-fundamentals',
    number: '4',
    title: 'Agent 核心原理',
    slug: 'agent-fundamentals',
    goal: '理解 Agent 的“感知-推理-行动”循环，掌握工具调用和记忆机制。',
    summary: '从 Agent 范式、ReAct、Function Calling 到工具、记忆与 LangChain 实战。',
    project: '构建一个能搜索网络、阅读文档、查询数据库并生成报告的个人研究助理 Agent。',
    moduleIds: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6']
  },
  {
    id: 'advanced-agent-orchestration',
    number: '5',
    title: 'Agent 进阶与编排',
    slug: 'advanced-agent-orchestration',
    goal: '掌握复杂工作流编排、多 Agent 协作和新兴协议标准。',
    summary: '聚焦 LangGraph、Agentic RAG、多 Agent、HITL、MCP 与 A2A。',
    project: '使用 LangGraph 构建多步骤 Agentic RAG 工作流，覆盖检索、联网、协作、审批与报告生成。',
    moduleIds: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8']
  },
  {
    id: 'production-ai-systems',
    number: '6',
    title: '生产级 AI 系统',
    slug: 'production-ai-systems',
    goal: '将所学从“Demo”变成“产品”，关注真实世界的工程挑战。',
    summary: '覆盖 GraphRAG、多模态、上下文工程、可观测性、成本优化与安全合规。',
    project: '构建一个整合 RAG、Agent、多工具、可观测性与安全护栏的生产级 AI 应用系统。',
    moduleIds: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7']
  }
]);
