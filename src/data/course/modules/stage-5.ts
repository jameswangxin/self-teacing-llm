import { CourseModuleSchema } from '../schema';

export const stage5Modules = CourseModuleSchema.array().parse([
  {
    id: '5.1',
    number: '5.1',
    title: '为什么需要 LangGraph',
    slug: 'why-langgraph',
    stageId: 'advanced-agent-orchestration',
    summary: '理解为什么线性 Agent 框架难以承载复杂流程，并建立“用图而不是单链路”编排 Agent 工作流的心智模型。',
    estimatedTime: '30 分钟',
    prerequisites: ['4.2', '4.6'],
    keyPoints: [
      '理解 LangChain 传统 Agent 在线性循环、可回溯性和复杂分支表达上的限制',
      '掌握 LangGraph 把节点、状态和边显式化后的编排思路',
      '区分 LangChain 与 LangGraph 的定位差异，以及二者组合使用的方式',
      '建立“需要工作流控制就上图，不需要就保持简单”的工程判断'
    ]
  },
  {
    id: '5.2',
    number: '5.2',
    title: 'LangGraph 核心概念',
    slug: 'langgraph-core-concepts',
    stageId: 'advanced-agent-orchestration',
    summary: '从 Node、Edge、State 到 `compile()`、`invoke()`、`stream()`，建立 LangGraph 的最小可运行模型。',
    estimatedTime: '35 分钟',
    prerequisites: ['5.1'],
    keyPoints: [
      '掌握 Directed Graph 中 Node、Edge、State 的角色分工',
      '理解共享状态如何在多步流程中替代隐式上下文拼接',
      '学会从图定义到 `compile()` 再到 `invoke()` 或 `stream()` 的执行过程',
      '理解条件分支如何让流程按状态动态选择下一条路径'
    ]
  },
  {
    id: '5.3',
    number: '5.3',
    title: 'LangGraph 高级特性',
    slug: 'langgraph-advanced-features',
    stageId: 'advanced-agent-orchestration',
    summary: '把 LangGraph 从“能跑”推进到“能恢复、能重试、能复用、能处理复杂循环”的工程级工作流框架。',
    estimatedTime: '40 分钟',
    prerequisites: ['5.2'],
    keyPoints: [
      '掌握 Conditional Edges、Cycles 与 Subgraphs 的组合方式',
      '理解 Checkpointing 如何支持中断恢复、长流程持久化与审计',
      '认识 Streaming 在调试体验和用户反馈上的价值',
      '理解错误处理、重试与幂等设计为什么是图工作流稳定性的关键'
    ]
  },
  {
    id: '5.4',
    number: '5.4',
    title: 'Agentic RAG',
    slug: 'agentic-rag',
    stageId: 'advanced-agent-orchestration',
    summary: '学习让检索系统具备自我反思、纠错和动态决策能力，并判断何时值得从简单 RAG 升级到 Agentic RAG。',
    estimatedTime: '40 分钟',
    prerequisites: ['3.7', '5.3'],
    keyPoints: [
      '区分 Self-RAG、CRAG 与 Adaptive RAG 分别在解决什么问题',
      '理解检索、评估、改写与补充搜索如何在 Agent 闭环中协同',
      '掌握判断简单 RAG 是否失效的症状与升级触发条件',
      '建立准确率、延迟、成本和可解释性之间的取舍意识'
    ]
  },
  {
    id: '5.5',
    number: '5.5',
    title: 'Multi-Agent 协作系统',
    slug: 'multi-agent-collaboration',
    stageId: 'advanced-agent-orchestration',
    summary: '把复杂任务拆给多个专职 Agent，理解不同协作拓扑、协调成本与 LangGraph 落地方式。',
    estimatedTime: '40 分钟',
    prerequisites: ['5.3'],
    keyPoints: [
      '比较 Supervisor、Peer-to-Peer、Hierarchical 和 Sequential 四类协作模式',
      '理解多 Agent 系统里的任务拆分、状态共享和冲突协调问题',
      '掌握用 LangGraph 把多个 Agent 视为节点或子图的实现思路',
      '认识 CrewAI 与 AutoGen 在抽象层级和控制方式上的差异'
    ]
  },
  {
    id: '5.6',
    number: '5.6',
    title: 'Human-in-the-Loop',
    slug: 'human-in-the-loop',
    stageId: 'advanced-agent-orchestration',
    summary: '设计可审批、可中断、可恢复的 Agent 流程，把自治能力放进人类监督和风险控制框架里。',
    estimatedTime: '35 分钟',
    prerequisites: ['5.3', '5.5'],
    keyPoints: [
      '理解审批节点、人工确认和例外处理在高风险流程中的作用',
      '掌握 interrupt/resume 对长流程和人工介入的支撑方式',
      '区分输入约束、工具权限、输出校验等不同层次的 guardrails',
      '建立从低风险自动化到高风险审批的渐进式自治设计思路'
    ]
  },
  {
    id: '5.7',
    number: '5.7',
    title: 'MCP 协议',
    slug: 'model-context-protocol',
    stageId: 'advanced-agent-orchestration',
    summary: '理解 MCP 如何把工具、资源和提示词以统一协议暴露给模型应用，并区分它与传统函数调用的边界。',
    estimatedTime: '35 分钟',
    prerequisites: ['4.3', '5.3'],
    keyPoints: [
      '掌握 MCP 中 Host、Client、Server 三个角色及其交互关系',
      '理解 Tools、Resources、Prompts 三类能力在协议中的定位',
      '认识动态发现与统一接口如何降低工具接入和切换成本',
      '区分 MCP 与 Function Calling 在抽象层级和适用场景上的差异'
    ]
  },
  {
    id: '5.8',
    number: '5.8',
    title: 'A2A 协议',
    slug: 'agent-to-agent',
    stageId: 'advanced-agent-orchestration',
    summary: '理解 Agent 之间如何通过标准协议描述能力、协作执行任务，并把 A2A 与 MCP 组合成多 Agent 工作流架构。',
    estimatedTime: '40 分钟',
    prerequisites: ['5.5', '5.7'],
    keyPoints: [
      '掌握 Agent Card、Task、Message、Artifact 等 A2A 核心对象',
      '区分 A2A 解决“Agent 如何协作”与 MCP 解决“Agent 如何接工具”的不同问题',
      '理解 A2A 与 MCP 的互补架构如何支撑跨团队多 Agent 系统',
      '能够规划一个覆盖检索、协作、审批与交付物生成的多步骤 Agentic RAG 项目'
    ]
  }
]);
