import { CourseModuleSchema } from '../schema';

export const stage1Modules = CourseModuleSchema.array().parse([
  {
    id: '1.1',
    number: '1.1',
    title: 'LLM 到底是什么',
    slug: 'what-is-an-llm',
    stageId: 'ai-engineering-foundation',
    summary: '建立对 LLM 工作方式、训练阶段、模型类型与能力边界的整体认知框架。',
    estimatedTime: '25 分钟',
    prerequisites: [],
    keyPoints: [
      '用“根据上下文预测下一个 token”理解 Transformer 的工作直觉',
      '分清预训练、微调、推理三个阶段分别解决什么问题',
      '理解开源与闭源模型在能力、成本、可控性上的取舍',
      '认识知识截止、幻觉与推理局限等常见边界'
    ]
  },
  {
    id: '1.2',
    number: '1.2',
    title: 'Token 与上下文窗口',
    slug: 'tokens-and-context-windows',
    stageId: 'ai-engineering-foundation',
    summary: '理解 token 计数、上下文窗口大小、计费方式与长上下文中的实际限制。',
    estimatedTime: '25 分钟',
    prerequisites: ['1.1'],
    keyPoints: [
      '理解 token 不是“字数”，而是模型内部处理文本的最小片段',
      '掌握中文、英文与代码在 token 消耗上的常见差异',
      '理解 4K、32K、128K、1M 上下文窗口在真实任务中的意义',
      '认识输入输出计费和长上下文注意力衰减问题'
    ]
  },
  {
    id: '1.3',
    number: '1.3',
    title: '模型参数与行为控制',
    slug: 'model-parameters-and-control',
    stageId: 'ai-engineering-foundation',
    summary: '通过常见采样参数理解如何控制模型输出的稳定性、长度与终止方式。',
    estimatedTime: '20 分钟',
    prerequisites: ['1.1', '1.2'],
    keyPoints: [
      '掌握 temperature 对输出随机性与稳定性的影响',
      '理解 top-p 与 temperature 的差异以及如何搭配使用',
      '学会用 max tokens 和 stop sequences 约束输出边界',
      '通过同 prompt 对比实验形成参数调优直觉'
    ]
  },
  {
    id: '1.4',
    number: '1.4',
    title: 'Prompt Engineering 基础',
    slug: 'prompt-engineering-basics',
    stageId: 'ai-engineering-foundation',
    summary: '建立写 prompt 的基本方法，学会清晰下达任务、约束格式并系统调试输出。',
    estimatedTime: '30 分钟',
    prerequisites: ['1.1', '1.3'],
    keyPoints: [
      '分清 system、user、assistant 三种消息角色的职责',
      '理解 zero-shot 与 few-shot 的适用场景和成本差异',
      '学会通过明确任务、约束和格式提高输出质量',
      '掌握结构化输出与 prompt 调试的基础方法'
    ]
  },
  {
    id: '1.5',
    number: '1.5',
    title: 'Prompt Engineering 进阶',
    slug: 'advanced-prompt-engineering',
    stageId: 'ai-engineering-foundation',
    summary: '学习更复杂的提示策略，包括推理增强、角色设定、链式拆解与常见反模式修正。',
    estimatedTime: '30 分钟',
    prerequisites: ['1.4'],
    keyPoints: [
      '理解 CoT、自一致性和角色提示各自提升效果的机制',
      '学会将复杂任务拆为多个简单 prompt 串联执行',
      '识别常见 prompt 反模式并改写为可执行指令',
      '建立“先拆问题、再控格式、后做验证”的进阶习惯'
    ]
  },
  {
    id: '1.6',
    number: '1.6',
    title: '开发环境搭建',
    slug: 'development-environment-setup',
    stageId: 'ai-engineering-foundation',
    summary: '搭建 Python 与 Notebook 开发环境，建立规范项目结构并正确管理依赖和密钥。',
    estimatedTime: '25 分钟',
    prerequisites: ['1.4'],
    keyPoints: [
      '理解 uv 与 venv 在 Python 环境管理中的定位',
      '建立适合 AI 项目的目录结构和依赖管理方式',
      '掌握 Notebook 的实验用途与工程化边界',
      '用环境变量和 .env 文件安全管理 API Key'
    ]
  },
  {
    id: '1.7',
    number: '1.7',
    title: 'LLM API 调用实战',
    slug: 'llm-api-practice',
    stageId: 'ai-engineering-foundation',
    summary: '把前面的知识落到 API 调用与命令行聊天工具实战，覆盖流式输出、多模型与容错。',
    estimatedTime: '35 分钟',
    prerequisites: ['1.3', '1.6'],
    keyPoints: [
      '理解 OpenAI-compatible 聊天接口的常见参数和消息结构',
      '掌握流式响应、重试、超时与速率限制处理的基本套路',
      '理解不同模型服务商在接入方式和能力上的差异',
      '能够规划一个支持多模型切换的 CLI 聊天助手'
    ]
  }
]);
