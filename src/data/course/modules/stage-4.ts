import { CourseModuleSchema } from '../schema';

export const stage4Modules = CourseModuleSchema.array().parse([
  {
    id: '4.1',
    number: '4.1',
    title: '从 LLM 到 Agent：范式跃迁',
    slug: 'llm-to-agent-shift',
    stageId: 'agent-fundamentals',
    summary: '把“会聊天的模型”升级为“会规划、会调用工具、会维护状态的系统”，建立 Agent 的整体心智模型。',
    estimatedTime: '30 分钟',
    prerequisites: ['1.7', '3.7'],
    keyPoints: [
      '分清纯 LLM 对话和 Agent 在闭环执行能力上的本质差异',
      '掌握 LLM、Tools、Memory、Planning 四要素模型及其分工',
      '理解从纯指令执行到高度自主的 Agent 自主性光谱',
      '认识个人助理、数据分析、自动化运维和研究助手等典型落地场景'
    ]
  },
  {
    id: '4.2',
    number: '4.2',
    title: 'ReAct 模式详解',
    slug: 'react-pattern',
    stageId: 'agent-fundamentals',
    summary: '理解 Agent 如何在“思考、行动、观察”的循环中做出工具选择，并识别这种模式的能力边界。',
    estimatedTime: '30 分钟',
    prerequisites: ['4.1'],
    keyPoints: [
      '掌握 ReAct 中 Thought、Action、Observation 三段式 prompt 结构',
      '理解 think-act-observe 循环如何驱动多步问题求解',
      '学会判断什么时候该调用工具，什么时候该直接回答',
      '认识线性推理、无法回溯和循环卡死等典型局限'
    ]
  },
  {
    id: '4.3',
    number: '4.3',
    title: 'Function Calling 机制',
    slug: 'function-calling',
    stageId: 'agent-fundamentals',
    summary: '把工具调用从 prompt 技巧升级为结构化协议，掌握 schema 设计、调用控制和多厂商差异。',
    estimatedTime: '35 分钟',
    prerequisites: ['1.7', '4.2'],
    keyPoints: [
      '理解函数定义、模型决策、外部执行、结果回填的完整协议闭环',
      '掌握 `name`、`description`、`parameters` 等 schema 设计规范',
      '理解 `tool_choice`、自动选择和并行调用对行为控制的影响',
      '认识 OpenAI、Claude、DeepSeek 等工具调用协议在消息格式上的差异'
    ]
  },
  {
    id: '4.4',
    number: '4.4',
    title: '自定义工具开发',
    slug: 'tool-development',
    stageId: 'agent-fundamentals',
    summary: '学习把搜索、计算、数据库和文件能力封装成稳定工具，并为 Agent 提供可理解、可恢复的执行接口。',
    estimatedTime: '35 分钟',
    prerequisites: ['4.3'],
    keyPoints: [
      '理解工具描述决定模型能否正确选择和使用工具',
      '掌握搜索、计算、数据库、API 与文件工具的常见设计方式',
      '学会处理超时、空结果、参数错误和外部依赖失败',
      '理解结果格式化如何影响后续推理与答案质量'
    ]
  },
  {
    id: '4.5',
    number: '4.5',
    title: 'Memory 系统',
    slug: 'memory-systems',
    stageId: 'agent-fundamentals',
    summary: '系统化理解短期记忆、长期记忆和工作记忆的职责边界，建立“该记什么、何时忘掉”的工程判断。',
    estimatedTime: '30 分钟',
    prerequisites: ['4.1', '4.4'],
    keyPoints: [
      '区分 Buffer、Window、Token Buffer 等短期记忆策略的适用场景',
      '理解向量检索记忆与结构化长期存储的能力边界',
      '掌握 Scratchpad 作为工作记忆对多步推理的价值',
      '建立写入门槛、压缩总结和遗忘清理的策略意识'
    ]
  },
  {
    id: '4.6',
    number: '4.6',
    title: 'LangChain Agent 实战',
    slug: 'langchain-agent-practice',
    stageId: 'agent-fundamentals',
    summary: '把 Agent 的核心组件串成可调试、可观测、可排障的 LangChain 实战流程，并落到研究助理项目。',
    estimatedTime: '40 分钟',
    prerequisites: ['4.2', '4.3', '4.4', '4.5'],
    keyPoints: [
      '掌握 LangChain Agent 与 Agent Executor 的基本运行流程',
      '学会用 verbose 日志和 LangSmith trace 观察决策链路',
      '理解死循环、工具误用和推理偏差的常见排查方式',
      '能够规划一个最小可用的个人研究助理 Agent 项目'
    ]
  }
]);
