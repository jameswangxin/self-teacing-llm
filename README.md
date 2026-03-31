# RAG 与 Agent 学习网站

一个基于 Astro 构建的本地优先学习网站，用来系统化学习 `RAG`、`Agent`、`LangGraph`、`MCP`、`A2A` 和生产级 AI 系统设计。

网站内容来自当前仓库中的 [GUIDE.md](/Users/wangxin/Documents/llm-learn/self-teacing-llm/GUIDE.md)，并已经整理为 6 个阶段、42 个模块的课程结构，支持模块级学习进度记录。

## 特性

- 6 个阶段、42 个模块的完整课程内容
- 首页、阶段页、模块索引页、模块详情页
- 模块级完成状态，本地 `localStorage` 持久化
- `继续学习` 入口，自动跳转到第一个未完成模块
- 缺内容时的降级提示与无 JavaScript 回退
- 内部链接校验、内容覆盖测试、构建校验脚本

## 技术栈

- [Astro](https://astro.build/)
- TypeScript
- Astro Content Collections
- Vitest

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

## 验证命令

运行测试：

```bash
npm run test
```

运行类型检查：

```bash
npm run check
```

校验构建后的内部链接：

```bash
npm run verify:links
```

一键跑完整验证：

```bash
npm run verify
```

## 项目结构

```text
src/
  components/
    content/      # 缺内容提示等内容组件
    course/       # 首页、模块、阶段、进度相关组件
    site/         # 顶部导航、侧边栏、移动端抽屉
    ui/           # 通用 UI 组件
  content/
    modules/      # 42 个模块的 Markdown 正文
  data/
    course/       # 阶段与模块 metadata、schema
  layouts/        # 共享页面布局
  lib/            # 课程排序、内容合并、进度工具
  pages/          # 首页、阶段页、模块索引页、模块详情页
  scripts/        # 浏览器端 continue-learning / progress 脚本
tests/unit/       # 单元测试与内容覆盖测试
scripts/          # 构建产物链接校验脚本
docs/superpowers/ # 设计文档与实现计划
```

## 内容组织

- 阶段和模块的结构化数据放在 `src/data/course/`
- 模块正文放在 `src/content/modules/`
- 页面通过 metadata + Markdown 内容组合生成

当前课程分为：

1. AI 工程基础
2. RAG 核心原理
3. RAG 进阶优化
4. Agent 核心原理
5. Agent 进阶与编排
6. 生产级 AI 系统

## 进度记录

- 进度只保存在当前浏览器
- 存储键为 `self-teaching-llm-progress-v1`
- 不依赖后端、账号系统或云同步

## 文档

- 设计文档：[docs/superpowers/specs/2026-03-30-rag-agent-learning-site-design.md](/Users/wangxin/Documents/llm-learn/self-teacing-llm/docs/superpowers/specs/2026-03-30-rag-agent-learning-site-design.md)
- 实现计划：[docs/superpowers/plans/2026-03-30-rag-agent-learning-site.md](/Users/wangxin/Documents/llm-learn/self-teacing-llm/docs/superpowers/plans/2026-03-30-rag-agent-learning-site.md)

## 当前状态

当前仓库已经完成：

- 课程内容整理与结构化
- 页面实现
- 进度持久化
- 测试、类型检查、链接校验

推荐在任何改动后运行：

```bash
npm run verify
```
