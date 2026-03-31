# RAG 与 Agent 学习网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight Astro learning website from `GUIDE.md`, with 42 detailed module pages, document-style navigation, and module-level progress tracking stored locally in the browser.

**Architecture:** Keep course structure in TypeScript data files and detailed module prose in Markdown content files so navigation and content stay decoupled. Generate the home page, stage pages, module index, and module detail pages statically with Astro, then enhance completion tracking and the continue-learning CTA with a tiny client-side layer backed by `localStorage`.

**Tech Stack:** Astro, TypeScript, Astro Content Collections, Markdown, plain CSS, Vitest

---

## Working Assumptions

- The approved spec is [2026-03-30-rag-agent-learning-site-design.md](/Users/wangxin/Documents/llm-learn/self-teacing-llm/docs/superpowers/specs/2026-03-30-rag-agent-learning-site-design.md).
- The current workspace is not a Git repository. Keep the commit steps in place for future use, but skip them if `git status` still fails when execution starts.
- “Run locally” means `npm run dev`, `npm run preview`, or another local static HTTP server. Do not target `file://` for full functionality.
- Module “上一页 / 下一页” navigation must follow the full 42-module global order, including jumps across stage boundaries.
- Desktop sidebar behavior should be explicit:
  - Home page: no left sidebar.
  - Module index page: left sidebar lists the 6 stages only.
  - Stage page: left sidebar lists the 6 stages and expands the current stage’s modules.
  - Module detail page: left sidebar lists the 6 stages and expands the current stage’s modules.
- The missing-content fallback is defensive only. Final acceptance still requires full正文 coverage for all 42 modules.

## Planned File Structure

- Create `package.json` to define Astro, Vitest, and project scripts.
- Create `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`, and `.gitignore` for project scaffolding.
- Create `src/data/course/schema.ts` for schema-backed validation of stage and module metadata.
- Create `src/data/course/stages.ts` for the 6 stage records derived from `GUIDE.md`.
- Create `src/data/course/modules/stage-1.ts` through `src/data/course/modules/stage-6.ts` for module metadata that supplements `GUIDE.md`.
- Create `src/data/course/modules/index.ts` to export the global module list in learning order.
- Create `src/content/config.ts` to validate Markdown frontmatter.
- Create `src/content/modules/stage-1/*.md` through `src/content/modules/stage-6/*.md` for module正文.
- Create `src/lib/course.ts` for stage/module lookup, ordering, grouping, and cross-stage pager helpers.
- Create `src/lib/progress.ts` for pure progress-state utilities and `localStorage` key handling.
- Create `src/layouts/DocsLayout.astro` for the shared document shell.
- Create `src/components/site/NavDrawerToggle.astro` for mobile navigation disclosure.
- Create `src/components/site/*.astro` for global navigation and sidebar.
- Create `src/components/course/*.astro` for the site hero, feature pillars, stage cards, stage pager, module rows, progress controls, pager nav, project cards, storage notice, and continue-learning CTA.
- Create `src/components/content/*.astro` for content rendering helpers and missing-content notices.
- Create `src/styles/tokens.css` and `src/styles/global.css` for design tokens and base styling.
- Create `scripts/verify-links.mjs` to validate internal links in the built `dist/` output.
- Create `src/scripts/progress.ts` and `src/scripts/continue-learning.ts` for client-side enhancement.
- Create `src/pages/index.astro`, `src/pages/modules/index.astro`, `src/pages/stages/[slug].astro`, and `src/pages/modules/[slug].astro` for the final routes.
- Create `tests/unit/course.test.ts`, `tests/unit/progress.test.ts`, and `tests/unit/content-coverage.test.ts` for pure logic coverage.

### Task 1: Bootstrap the Astro Workspace

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `package.json` with the base scripts and dependencies**

```json
{
  "name": "self-teaching-llm",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "astro": "^5.0.0",
    "typescript": "^5.6.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Add the Astro and TypeScript config files**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  server: {
    host: true
  }
});
```

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"]
}
```

- [ ] **Step 3: Add a minimal smoke page and ignore rules**

```astro
---
const title = 'RAG 与 Agent 学习网站';
---

<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
  </head>
  <body>
    <main>{title}</main>
  </body>
</html>
```

```gitignore
node_modules
dist
.astro
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`  
Expected: install completes successfully and creates `package-lock.json`

- [ ] **Step 5: Verify the empty scaffold builds**

Run: `npm run check && npm run build`  
Expected: Astro type-check passes and `dist/` is generated

- [ ] **Step 6: Commit the scaffold if Git is available**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/env.d.ts src/pages/index.astro
git commit -m "chore: scaffold astro learning site"
```

### Task 2: Define Course Schemas and Navigation Helpers

**Files:**
- Create: `src/content/config.ts`
- Create: `src/data/course/schema.ts`
- Create: `src/data/course/stages.ts`
- Create: `src/data/course/modules/index.ts`
- Create: `src/lib/course.ts`
- Test: `tests/unit/course.test.ts`

- [ ] **Step 1: Write the failing navigation helper test**

```ts
import { describe, expect, it } from 'vitest';
import { getAdjacentModuleIds, groupModulesByStage } from '../../src/lib/course';

describe('course helpers', () => {
  it('links modules across stage boundaries', () => {
    const modules = [
      { id: '1.7', stageId: 'ai-engineering-foundation' },
      { id: '2.1', stageId: 'rag-fundamentals' },
      { id: '2.2', stageId: 'rag-fundamentals' }
    ] as const;

    expect(getAdjacentModuleIds(modules, '2.1')).toEqual({
      prevId: '1.7',
      nextId: '2.2'
    });
  });
});
```

- [ ] **Step 2: Run the helper test and confirm it fails before implementation**

Run: `npm run test -- tests/unit/course.test.ts`  
Expected: FAIL because `src/lib/course.ts` does not exist yet

- [ ] **Step 3: Create the content collection schema for module正文**

```ts
import { defineCollection, z } from 'astro:content';

const modules = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^\d\.\d$/)
  })
});

export const collections = { modules };
```

- [ ] **Step 4: Create `src/data/course/schema.ts` with stage/module validation**

```ts
import { z } from 'astro:content';

export const CourseModuleSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  slug: z.string(),
  stageId: z.string(),
  summary: z.string(),
  estimatedTime: z.string(),
  prerequisites: z.array(z.string()),
  keyPoints: z.array(z.string()).min(3)
});

export const CourseStageSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  slug: z.string(),
  goal: z.string(),
  summary: z.string(),
  project: z.string(),
  moduleIds: z.array(z.string())
});
```

- [ ] **Step 5: Create `src/data/course/stages.ts` with the 6 stage records from the spec**

```ts
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
  }
]);
```

Add the remaining stage records explicitly with these exact titles and slugs:

- `RAG 核心原理` -> `rag-fundamentals` with `moduleIds: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7']`
- `RAG 进阶优化` -> `advanced-rag` with `moduleIds: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7']`
- `Agent 核心原理` -> `agent-fundamentals` with `moduleIds: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6']`
- `Agent 进阶与编排` -> `advanced-agent-orchestration` with `moduleIds: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8']`
- `生产级 AI 系统` -> `production-ai-systems` with `moduleIds: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7']`

- [ ] **Step 6: Create the initial module index and helper implementations**

```ts
// src/data/course/modules/index.ts
export const modules = [];
```

```ts
// src/lib/course.ts
export function getAdjacentModuleIds(
  modules: Array<{ id: string }>,
  currentId: string
) {
  const index = modules.findIndex((module) => module.id === currentId);
  return {
    prevId: index > 0 ? modules[index - 1].id : null,
    nextId: index >= 0 && index < modules.length - 1 ? modules[index + 1].id : null
  };
}
```

- [ ] **Step 7: Extend `src/lib/course.ts` to support the final page layer**

Implement helpers for:

```ts
groupModulesByStage(modules)
getStageBySlug(slug)
getModuleBySlug(slug)
getStageModules(stageId)
buildSidebarModel(pageType, currentStageId?, currentModuleId?)
```

Use the parsed schema-backed arrays as the source of truth so missing required fields fail fast during build and test runs.

- [ ] **Step 8: Re-run the helper test**

Run: `npm run test -- tests/unit/course.test.ts`  
Expected: PASS

- [ ] **Step 9: Commit if Git is available**

```bash
git add src/content/config.ts src/data/course/schema.ts src/data/course/stages.ts src/data/course/modules/index.ts src/lib/course.ts tests/unit/course.test.ts
git commit -m "feat: define course schemas and helpers"
```

### Task 3: Build the Shared Layout and Design Tokens

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/layouts/DocsLayout.astro`
- Create: `src/components/site/NavDrawerToggle.astro`
- Create: `src/components/site/TopNav.astro`
- Create: `src/components/site/Sidebar.astro`
- Create: `src/components/ui/Badge.astro`

- [ ] **Step 1: Create the design tokens file**

```css
:root {
  --bg: #f3f6f6;
  --panel: rgba(255, 255, 255, 0.82);
  --text: #102227;
  --muted: #50656b;
  --accent: #0f766e;
  --accent-strong: #0b4f4a;
  --border: rgba(16, 34, 39, 0.12);
  --radius-lg: 24px;
  --radius-md: 16px;
  --content-width: 780px;
}
```

- [ ] **Step 2: Create the global CSS with layout and typography rules**

```css
body {
  margin: 0;
  color: var(--text);
  background:
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.12), transparent 28rem),
    linear-gradient(180deg, #eef6f5 0%, #f8fbfb 100%);
  font-family: "IBM Plex Sans", "Noto Sans SC", sans-serif;
}
```

- [ ] **Step 3: Implement `DocsLayout.astro` with page-type-aware sidebar support**

```astro
---
import '../styles/tokens.css';
import '../styles/global.css';
import TopNav from '../components/site/TopNav.astro';
import Sidebar from '../components/site/Sidebar.astro';

const { title, sidebar } = Astro.props;
---

<html lang="zh-CN">
  <body>
    <TopNav />
    <div class:list={['page-shell', !sidebar && 'page-shell--full']}>
      {sidebar && <Sidebar model={sidebar} />}
      <main class="page-content">
        <slot />
      </main>
    </div>
  </body>
</html>
```

- [ ] **Step 4: Implement the top navigation and sidebar components**

The top navigation should expose links to:

- `/`
- `/modules/`

The sidebar should support two models:

- Stage list only
- Stage list with current stage modules expanded and the current module highlighted

Use `Badge.astro` for stage number pills, estimated-time chips, and completion-state labels so it has a concrete role in the system.

- [ ] **Step 5: Implement mobile navigation explicitly**

Add `NavDrawerToggle.astro` and wire it into `TopNav.astro` so small screens can:

- open the sidebar as a drawer or sheet
- close it after tapping a navigation target
- access the same stage/module links without relying on the desktop layout

- [ ] **Step 6: Verify the shared shell compiles**

Run: `npm run build`  
Expected: PASS with the shared shell files compiling cleanly

- [ ] **Step 7: Commit if Git is available**

```bash
git add src/styles/tokens.css src/styles/global.css src/layouts/DocsLayout.astro src/components/site/NavDrawerToggle.astro src/components/site/TopNav.astro src/components/site/Sidebar.astro src/components/ui/Badge.astro
git commit -m "feat: add shared layout and design tokens"
```

### Task 4: Author Stage 1 Metadata and Module Content

**Files:**
- Create: `src/data/course/modules/stage-1.ts`
- Modify: `src/data/course/modules/index.ts`
- Create: `src/content/modules/stage-1/1-1-what-is-an-llm.md`
- Create: `src/content/modules/stage-1/1-2-tokens-and-context-windows.md`
- Create: `src/content/modules/stage-1/1-3-model-parameters-and-control.md`
- Create: `src/content/modules/stage-1/1-4-prompt-engineering-basics.md`
- Create: `src/content/modules/stage-1/1-5-advanced-prompt-engineering.md`
- Create: `src/content/modules/stage-1/1-6-development-environment-setup.md`
- Create: `src/content/modules/stage-1/1-7-llm-api-practice.md`

- [ ] **Step 1: Add stage 1 module metadata**

```ts
import { CourseModuleSchema } from '../schema';

export const stage1Modules = CourseModuleSchema.array().parse([
  {
    id: '1.1',
    number: '1.1',
    title: 'LLM 到底是什么',
    slug: 'what-is-an-llm',
    stageId: 'ai-engineering-foundation',
    summary: '建立对 Transformer、预训练、微调和推理阶段的工程直觉。',
    estimatedTime: '35 min',
    prerequisites: [],
    keyPoints: ['Transformer 直觉', '预训练 / 微调 / 推理', '能力边界']
  }
]);
```

Add the remaining stage 1 module records explicitly with these exact titles and slugs:

- `1.2` `Token 与上下文窗口` -> `tokens-and-context-windows`
- `1.3` `模型参数与行为控制` -> `model-parameters-and-control`
- `1.4` `Prompt Engineering 基础` -> `prompt-engineering-basics`
- `1.5` `Prompt Engineering 进阶` -> `advanced-prompt-engineering`
- `1.6` `开发环境搭建` -> `development-environment-setup`
- `1.7` `LLM API 调用实战` -> `llm-api-practice`

- [ ] **Step 2: Re-export stage 1 metadata from `src/data/course/modules/index.ts`**

```ts
import { stage1Modules } from './stage-1';

export const modules = [...stage1Modules];
```

- [ ] **Step 3: Use this Markdown template for every stage 1 content file**

```md
---
id: "1.1"
---

## 为什么学这个

## 核心知识

## 关键对比 / 易错点

## 学习检查点

## 实践建议
```

Each module file should contain:

- 1 to 2 paragraphs in `为什么学这个`
- enough `核心知识` detail to teach the GUIDE bullets, not just restate them
- at least 3 concrete points in `关键对比 / 易错点`
- at least 3 questions in `学习检查点`
- at least 2 next actions in `实践建议`

- [ ] **Step 4: Write `1-1-what-is-an-llm.md`**

Ground it in the GUIDE topics: Transformer intuition, pretraining vs fine-tuning vs inference, open vs closed models, capability limits.

- [ ] **Step 5: Write `1-2-tokens-and-context-windows.md`**

Ground it in token counting, Chinese vs English tokenization, context window sizing, pricing, and attention decay.

- [ ] **Step 6: Write `1-3-model-parameters-and-control.md`**

Ground it in temperature, top-p, max tokens, stop sequences, and output comparison experiments.

- [ ] **Step 7: Write `1-4-prompt-engineering-basics.md`**

Ground it in system/user/assistant roles, zero-shot vs few-shot, instruction clarity, structured outputs, and prompt debugging.

- [ ] **Step 8: Write `1-5-advanced-prompt-engineering.md`**

Ground it in CoT, self-consistency, role prompting, prompt chaining, and common anti-patterns.

- [ ] **Step 9: Write `1-6-development-environment-setup.md`**

Ground it in `uv`/`venv`, project layout, dependencies, notebooks, and API key handling.

- [ ] **Step 10: Write `1-7-llm-api-practice.md`**

Ground it in OpenAI-compatible API calls, streaming, multi-model differences, retry handling, and the CLI chat project.

- [ ] **Step 11: Validate the stage 1 content**

Run: `npm run build`  
Expected: PASS with no frontmatter schema errors

- [ ] **Step 12: Commit if Git is available**

```bash
git add src/data/course/modules/stage-1.ts src/data/course/modules/index.ts src/content/modules/stage-1
git commit -m "docs: add stage 1 course content"
```

### Task 5: Author Stage 2 Metadata and Module Content

**Files:**
- Create: `src/data/course/modules/stage-2.ts`
- Modify: `src/data/course/modules/index.ts`
- Create: `src/content/modules/stage-2/2-1-why-rag.md`
- Create: `src/content/modules/stage-2/2-2-embedding-fundamentals.md`
- Create: `src/content/modules/stage-2/2-3-semantic-similarity.md`
- Create: `src/content/modules/stage-2/2-4-document-loading-and-preprocessing.md`
- Create: `src/content/modules/stage-2/2-5-chunking-strategies.md`
- Create: `src/content/modules/stage-2/2-6-vector-stores.md`
- Create: `src/content/modules/stage-2/2-7-basic-rag-pipeline.md`

All stage 2 module files must use the same five-section Markdown structure and minimum content standards defined in Task 4, Step 3.

- [ ] **Step 1: Add stage 2 module metadata in `src/data/course/modules/stage-2.ts`**

Include the 7 module records for `2.1` through `2.7`, with `stageId: 'rag-fundamentals'`, summary text, estimated times, prerequisites, and `keyPoints`, and wrap the exported array in `CourseModuleSchema.array().parse([...])`.

- [ ] **Step 2: Re-export stage 2 metadata from `src/data/course/modules/index.ts`**

```ts
import { stage1Modules } from './stage-1';
import { stage2Modules } from './stage-2';

export const modules = [...stage1Modules, ...stage2Modules];
```

- [ ] **Step 3: Write `2-1-why-rag.md`**

Cover the three LLM pain points, RAG mental model, RAG vs fine-tuning, and typical use cases.

- [ ] **Step 4: Write `2-2-embedding-fundamentals.md`**

Cover embeddings, semantic space intuition, model choices, and model limitations.

- [ ] **Step 5: Write `2-3-semantic-similarity.md`**

Cover cosine similarity, Euclidean distance, dot product, and how similarity changes under paraphrase.

- [ ] **Step 6: Write `2-4-document-loading-and-preprocessing.md`**

Cover loaders, cleaning, normalization, segmentation, and metadata annotation.

- [ ] **Step 7: Write `2-5-chunking-strategies.md`**

Cover fixed chunks, recursive splitting, semantic chunking, structure-aware chunking, and chunk size trade-offs.

- [ ] **Step 8: Write `2-6-vector-stores.md`**

Cover Chroma, FAISS, Milvus, Pinecone, Qdrant, Weaviate, HNSW, IVF, and persistence modes.

- [ ] **Step 9: Write `2-7-basic-rag-pipeline.md`**

Cover the end-to-end data flow, LangChain components, prompt injection of retrieved context, top-k, LCEL, and the document QA project.

- [ ] **Step 10: Validate the stage 2 content**

Run: `npm run build`  
Expected: PASS

- [ ] **Step 11: Commit if Git is available**

```bash
git add src/data/course/modules/stage-2.ts src/data/course/modules/index.ts src/content/modules/stage-2
git commit -m "docs: add stage 2 course content"
```

### Task 6: Author Stage 3 Metadata and Module Content

**Files:**
- Create: `src/data/course/modules/stage-3.ts`
- Modify: `src/data/course/modules/index.ts`
- Create: `src/content/modules/stage-3/3-1-rag-failure-modes.md`
- Create: `src/content/modules/stage-3/3-2-hybrid-search.md`
- Create: `src/content/modules/stage-3/3-3-query-transformation.md`
- Create: `src/content/modules/stage-3/3-4-reranking.md`
- Create: `src/content/modules/stage-3/3-5-context-management-and-compression.md`
- Create: `src/content/modules/stage-3/3-6-conversational-rag.md`
- Create: `src/content/modules/stage-3/3-7-rag-evaluation.md`

All stage 3 module files must use the same five-section Markdown structure and minimum content standards defined in Task 4, Step 3.

- [ ] **Step 1: Add stage 3 module metadata in `src/data/course/modules/stage-3.ts`**

Use `stageId: 'advanced-rag'`, keep the module order aligned with `GUIDE.md`, and wrap the exported array in `CourseModuleSchema.array().parse([...])`.

- [ ] **Step 2: Re-export stage 3 metadata from `src/data/course/modules/index.ts`**

Append `stage3Modules` after stage 2 so the global order stays `1.x -> 2.x -> 3.x`.

- [ ] **Step 3: Write `3-1-rag-failure-modes.md`**

Cover recall failure, faithfulness failure, lost-in-the-middle, query ambiguity, and the matching optimization map.

- [ ] **Step 4: Write `3-2-hybrid-search.md`**

Cover vector search weaknesses, BM25, hybrid search, RRF, and `EnsembleRetriever`.

- [ ] **Step 5: Write `3-3-query-transformation.md`**

Cover query rewriting, multi-query retrieval, HyDE, step-back prompting, and decomposition.

- [ ] **Step 6: Write `3-4-reranking.md`**

Cover why reranking exists, bi-encoder vs cross-encoder, reranker options, and contextual compression.

- [ ] **Step 7: Write `3-5-context-management-and-compression.md`**

Cover compression, parent-child retrieval, metadata filtering, and dynamic top-k.

- [ ] **Step 8: Write `3-6-conversational-rag.md`**

Cover history-aware retrieval, conversation summarization, multi-turn context, and conversational chains.

- [ ] **Step 9: Write `3-7-rag-evaluation.md`**

Cover context relevance, faithfulness, answer relevance, RAGAS, DeepEval, dataset building, and regression evaluation.

- [ ] **Step 10: Validate the stage 3 content**

Run: `npm run build`  
Expected: PASS

- [ ] **Step 11: Commit if Git is available**

```bash
git add src/data/course/modules/stage-3.ts src/data/course/modules/index.ts src/content/modules/stage-3
git commit -m "docs: add stage 3 course content"
```

### Task 7: Author Stage 4 Metadata and Module Content

**Files:**
- Create: `src/data/course/modules/stage-4.ts`
- Modify: `src/data/course/modules/index.ts`
- Create: `src/content/modules/stage-4/4-1-llm-to-agent-shift.md`
- Create: `src/content/modules/stage-4/4-2-react-pattern.md`
- Create: `src/content/modules/stage-4/4-3-function-calling.md`
- Create: `src/content/modules/stage-4/4-4-tool-development.md`
- Create: `src/content/modules/stage-4/4-5-memory-systems.md`
- Create: `src/content/modules/stage-4/4-6-langchain-agent-practice.md`

All stage 4 module files must use the same five-section Markdown structure and minimum content standards defined in Task 4, Step 3.

- [ ] **Step 1: Add stage 4 module metadata in `src/data/course/modules/stage-4.ts`**

Use `stageId: 'agent-fundamentals'`, include summaries that emphasize the move from single-turn LLM use to tool-using agents, and wrap the exported array in `CourseModuleSchema.array().parse([...])`.

- [ ] **Step 2: Re-export stage 4 metadata from `src/data/course/modules/index.ts`**

Append `stage4Modules` after stage 3.

- [ ] **Step 3: Write `4-1-llm-to-agent-shift.md`**

Cover the four-part agent model, autonomy spectrum, and typical use cases.

- [ ] **Step 4: Write `4-2-react-pattern.md`**

Cover ReAct prompt structure, think-act-observe loops, tool-choice decisions, and known limitations.

- [ ] **Step 5: Write `4-3-function-calling.md`**

Cover function schemas, `tool_choice`, parallel calls, and protocol differences across model vendors.

- [ ] **Step 6: Write `4-4-tool-development.md`**

Cover tool descriptions, common tool types, failure handling, and result formatting.

- [ ] **Step 7: Write `4-5-memory-systems.md`**

Cover short-term, long-term, and working memory plus write/forget strategies.

- [ ] **Step 8: Write `4-6-langchain-agent-practice.md`**

Cover Agent Executor flow, verbose debugging, LangSmith traces, dead loops, and the research assistant project.

- [ ] **Step 9: Validate the stage 4 content**

Run: `npm run build`  
Expected: PASS

- [ ] **Step 10: Commit if Git is available**

```bash
git add src/data/course/modules/stage-4.ts src/data/course/modules/index.ts src/content/modules/stage-4
git commit -m "docs: add stage 4 course content"
```

### Task 8: Author Stage 5 Metadata and Module Content

**Files:**
- Create: `src/data/course/modules/stage-5.ts`
- Modify: `src/data/course/modules/index.ts`
- Create: `src/content/modules/stage-5/5-1-why-langgraph.md`
- Create: `src/content/modules/stage-5/5-2-langgraph-core-concepts.md`
- Create: `src/content/modules/stage-5/5-3-langgraph-advanced-features.md`
- Create: `src/content/modules/stage-5/5-4-agentic-rag.md`
- Create: `src/content/modules/stage-5/5-5-multi-agent-collaboration.md`
- Create: `src/content/modules/stage-5/5-6-human-in-the-loop.md`
- Create: `src/content/modules/stage-5/5-7-model-context-protocol.md`
- Create: `src/content/modules/stage-5/5-8-agent-to-agent.md`

All stage 5 module files must use the same five-section Markdown structure and minimum content standards defined in Task 4, Step 3.

- [ ] **Step 1: Add stage 5 module metadata in `src/data/course/modules/stage-5.ts`**

Use `stageId: 'advanced-agent-orchestration'`, keep the module records in the `5.1 -> 5.8` order, and wrap the exported array in `CourseModuleSchema.array().parse([...])`.

- [ ] **Step 2: Re-export stage 5 metadata from `src/data/course/modules/index.ts`**

Append `stage5Modules` after stage 4.

- [ ] **Step 3: Write `5-1-why-langgraph.md`**

Cover why LangGraph exists, where LangChain agents fall short, and how graph orchestration changes the model.

- [ ] **Step 4: Write `5-2-langgraph-core-concepts.md`**

Cover nodes, edges, state, compile/invoke/stream, and conditional flow basics.

- [ ] **Step 5: Write `5-3-langgraph-advanced-features.md`**

Cover conditional edges, cycles, subgraphs, checkpointing, streaming, and retry behavior.

- [ ] **Step 6: Write `5-4-agentic-rag.md`**

Cover self-RAG, CRAG, adaptive RAG, and the decision framework for when simple RAG stops being enough.

- [ ] **Step 7: Write `5-5-multi-agent-collaboration.md`**

Cover supervisor, peer-to-peer, hierarchical, and sequential patterns plus LangGraph implementation considerations.

- [ ] **Step 8: Write `5-6-human-in-the-loop.md`**

Cover approval nodes, interrupt/resume, guardrails, and progressive autonomy.

- [ ] **Step 9: Write `5-7-model-context-protocol.md`**

Cover MCP host/client/server roles, tools/resources/prompts, dynamic discovery, and MCP vs function calling.

- [ ] **Step 10: Write `5-8-agent-to-agent.md`**

Cover A2A concepts, MCP vs A2A, agent cards, tasks, messages, artifacts, and the multi-agent workflow project.

- [ ] **Step 11: Validate the stage 5 content**

Run: `npm run build`  
Expected: PASS

- [ ] **Step 12: Commit if Git is available**

```bash
git add src/data/course/modules/stage-5.ts src/data/course/modules/index.ts src/content/modules/stage-5
git commit -m "docs: add stage 5 course content"
```

### Task 9: Author Stage 6 Metadata and Module Content

**Files:**
- Create: `src/data/course/modules/stage-6.ts`
- Modify: `src/data/course/modules/index.ts`
- Create: `src/content/modules/stage-6/6-1-graph-rag.md`
- Create: `src/content/modules/stage-6/6-2-multimodal-rag.md`
- Create: `src/content/modules/stage-6/6-3-context-engineering.md`
- Create: `src/content/modules/stage-6/6-4-observability-and-debugging.md`
- Create: `src/content/modules/stage-6/6-5-performance-and-cost-optimization.md`
- Create: `src/content/modules/stage-6/6-6-safety-and-compliance.md`
- Create: `src/content/modules/stage-6/6-7-production-capstone.md`

All stage 6 module files must use the same five-section Markdown structure and minimum content standards defined in Task 4, Step 3.

- [ ] **Step 1: Add stage 6 module metadata in `src/data/course/modules/stage-6.ts`**

Use `stageId: 'production-ai-systems'`, include the capstone module metadata for `6.7`, and wrap the exported array in `CourseModuleSchema.array().parse([...])`.

- [ ] **Step 2: Re-export stage 6 metadata from `src/data/course/modules/index.ts`**

Append `stage6Modules` after stage 5 and verify the final exported order covers all 42 modules.

- [ ] **Step 3: Write `6-1-graph-rag.md`**

Cover knowledge graphs, entities/relations/triples, GraphRAG architecture, extraction, and Neo4j integration.

- [ ] **Step 4: Write `6-2-multimodal-rag.md`**

Cover image/table/document parsing challenges, multimodal embeddings, and real-world scenarios.

- [ ] **Step 5: Write `6-3-context-engineering.md`**

Cover the shift from prompt engineering to context engineering, context sources, budgeting, and dynamic assembly.

- [ ] **Step 6: Write `6-4-observability-and-debugging.md`**

Cover tracing, evaluation, monitoring, LangSmith, Langfuse, and debugging methodology.

- [ ] **Step 7: Write `6-5-performance-and-cost-optimization.md`**

Cover embedding caches, semantic caches, LLM caches, async/batch processing, model routing, and local deployment awareness.

- [ ] **Step 8: Write `6-6-safety-and-compliance.md`**

Cover prompt injection, privacy leakage, output safety, and audit trails.

- [ ] **Step 9: Write `6-7-production-capstone.md`**

Cover the final production project options and how they connect the full curriculum.

- [ ] **Step 10: Validate the stage 6 content**

Run: `npm run build`  
Expected: PASS

- [ ] **Step 11: Commit if Git is available**

```bash
git add src/data/course/modules/stage-6.ts src/data/course/modules/index.ts src/content/modules/stage-6
git commit -m "docs: add stage 6 course content"
```

### Task 10: Implement the Home Page

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/course/SiteHero.astro`
- Create: `src/components/course/FeaturePillars.astro`
- Create: `src/components/course/StageCard.astro`
- Create: `src/components/course/MethodologyStrip.astro`
- Create: `src/components/course/ContinueLearningLink.astro`

- [ ] **Step 1: Replace the smoke page with a real home page route**

```astro
---
import DocsLayout from '../layouts/DocsLayout.astro';
import { stages } from '../data/course/stages';
import SiteHero from '../components/course/SiteHero.astro';
import FeaturePillars from '../components/course/FeaturePillars.astro';
import StageCard from '../components/course/StageCard.astro';
import MethodologyStrip from '../components/course/MethodologyStrip.astro';
import ContinueLearningLink from '../components/course/ContinueLearningLink.astro';
---

<DocsLayout title="RAG 与 Agent 学习网站">
  <SiteHero />
  <ContinueLearningLink />
  <FeaturePillars />
  {stages.map((stage) => <StageCard stage={stage} />)}
  <MethodologyStrip />
</DocsLayout>
```

- [ ] **Step 2: Build `SiteHero.astro` for the site positioning and core slogan**

It must clearly communicate:

- this is a `RAG 与 Agent` learning website
- the intended identity is “AI 架构师训练路线”
- the core direction is theory plus practice, not just concept memorization

- [ ] **Step 3: Build `FeaturePillars.astro` for the course feature section**

Render the three required pillars from the spec:

- `理论`
- `实战`
- `Spec Coding`

- [ ] **Step 4: Build `StageCard.astro` to show stage number, title, summary, and project CTA**

Each card should link to its stage page and visually support the “learning roadmap” framing.

- [ ] **Step 5: Build `MethodologyStrip.astro`**

Render the 5-step learning workflow from the spec:

`概念讲解 -> 架构图解 -> 代码识谱 -> Spec 练习 -> 实战项目`

- [ ] **Step 6: Build `ContinueLearningLink.astro` with a no-JS fallback**

Render a normal anchor with default `href="/modules/"`. The later client-side script will update it to the first incomplete module.

- [ ] **Step 7: Verify the home page**

Run: `npm run build`  
Expected: PASS and `/index.html` is generated

- [ ] **Step 8: Commit if Git is available**

```bash
git add src/pages/index.astro src/components/course/SiteHero.astro src/components/course/FeaturePillars.astro src/components/course/StageCard.astro src/components/course/MethodologyStrip.astro src/components/course/ContinueLearningLink.astro
git commit -m "feat: add course homepage"
```

### Task 11: Implement Stage Pages and the Module Index

**Files:**
- Create: `src/pages/stages/[slug].astro`
- Create: `src/pages/modules/index.astro`
- Create: `src/components/course/ModuleListItem.astro`
- Create: `src/components/course/StageProjectCard.astro`
- Create: `src/components/course/StagePager.astro`
- Modify: `src/components/site/Sidebar.astro`

- [ ] **Step 1: Create the dynamic stage route**

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro';
import { stages } from '../../data/course/stages';
import { getStageModules, buildSidebarModel } from '../../lib/course';

export function getStaticPaths() {
  return stages.map((stage) => ({ params: { slug: stage.slug }, props: { stage } }));
}
---
```

- [ ] **Step 2: Render each stage page with the stage goal, summary, module list, stage project, and previous/next stage navigation**

Use `ModuleListItem.astro` for the module rows, `StageProjectCard.astro` for the project block, and `StagePager.astro` for previous/next stage navigation.

- [ ] **Step 3: Create `StagePager.astro`**

It should link to the previous and next stage in the global 6-stage order and omit the missing side gracefully on the first and last stage pages.

- [ ] **Step 4: Build `src/pages/modules/index.astro`**

Group all modules by stage and render a scan-friendly “all modules” page. Its desktop sidebar should list the 6 stages only, with no module expansion.

- [ ] **Step 5: Update the sidebar to support page-type-specific models and current-module highlighting**

Support:

- stage-only list for `/modules/`
- expanded current-stage module list for stage pages
- expanded current-stage module list for module pages with the current module visually highlighted

- [ ] **Step 6: Verify stage pages and module index**

Run: `npm run build`  
Expected: PASS and every stage slug plus `/modules/index.html` is generated

- [ ] **Step 7: Commit if Git is available**

```bash
git add src/pages/stages/[slug].astro src/pages/modules/index.astro src/components/course/ModuleListItem.astro src/components/course/StageProjectCard.astro src/components/course/StagePager.astro src/components/site/Sidebar.astro
git commit -m "feat: add stage pages and module index"
```

### Task 12: Implement Module Detail Pages, Cross-Stage Pager, and Missing-Content Fallback

**Files:**
- Create: `src/pages/modules/[slug].astro`
- Create: `src/components/course/PagerNav.astro`
- Create: `src/components/content/MissingContentNotice.astro`
- Modify: `src/components/course/StageProjectCard.astro`
- Modify: `src/lib/course.ts`

- [ ] **Step 1: Extend `src/lib/course.ts` to merge module metadata with Markdown content entries**

Implement helpers for:

```ts
mapContentEntriesById(entries)
getRenderableModule(slug, entries)
getAdjacentModuleIds(modules, currentId)
```

- [ ] **Step 2: Create the dynamic module route**

`getStaticPaths()` must iterate over the global metadata list from `src/data/course/modules/index.ts`, not over content entries, so missing content can still render a fallback page.

- [ ] **Step 3: Render the module page sections in the required order**

The page should always render:

1. module title + stage label
2. module intro metadata
3. content body if present
4. missing-content notice if body is absent
5. associated stage project callout or navigation hint
6. completion control slot
7. cross-stage pager

When building the sidebar model for this page type, pass both `currentStageId` and `currentModuleId` so the current module can be highlighted.

- [ ] **Step 4: Create `PagerNav.astro`**

It must follow the full global order. Example: the previous module of `2.1` is `1.7`, and the next module of `5.8` is `6.1`.

- [ ] **Step 5: Create `MissingContentNotice.astro`**

```astro
<aside class="missing-content">
  <h2>内容暂缺</h2>
  <p>这个模块的正文还没有生成完成，请先返回阶段页或模块索引页继续学习。</p>
</aside>
```

- [ ] **Step 6: Verify module pages**

Run: `npm run build`  
Expected: PASS and all 42 `/modules/<slug>/index.html` pages are generated

- [ ] **Step 7: Commit if Git is available**

```bash
git add src/pages/modules/[slug].astro src/components/course/PagerNav.astro src/components/course/StageProjectCard.astro src/components/content/MissingContentNotice.astro src/lib/course.ts
git commit -m "feat: add module detail pages"
```

### Task 13: Implement Progress Persistence and Continue-Learning Behavior

**Files:**
- Create: `src/lib/progress.ts`
- Create: `src/components/course/CompletionToggle.astro`
- Create: `src/components/course/StorageNotice.astro`
- Create: `src/scripts/progress.ts`
- Create: `src/scripts/continue-learning.ts`
- Create: `tests/unit/progress.test.ts`
- Modify: `src/components/course/ContinueLearningLink.astro`
- Modify: `src/components/course/ModuleListItem.astro`
- Modify: `src/pages/modules/[slug].astro`

- [ ] **Step 1: Write the failing progress utility test**

```ts
import { describe, expect, it } from 'vitest';
import { getFirstIncompleteModuleId } from '../../src/lib/progress';

describe('progress helpers', () => {
  it('returns the first incomplete module in global order', () => {
    expect(
      getFirstIncompleteModuleId(
        ['1.1', '1.2', '2.1'],
        { '1.1': true }
      )
    ).toBe('1.2');
  });
});
```

- [ ] **Step 2: Run the progress test and confirm it fails**

Run: `npm run test -- tests/unit/progress.test.ts`  
Expected: FAIL because `src/lib/progress.ts` does not exist yet

- [ ] **Step 3: Implement `src/lib/progress.ts`**

```ts
export const PROGRESS_STORAGE_KEY = 'self-teaching-llm-progress-v1';

export function getFirstIncompleteModuleId(
  orderedIds: string[],
  progress: Record<string, boolean>
) {
  return orderedIds.find((id) => !progress[id]) ?? null;
}
```

Also implement:

```ts
readProgress()
writeProgress(nextProgress)
toggleModule(progress, moduleId)
canUseStorage()
```

- [ ] **Step 4: Create `CompletionToggle.astro`, `StorageNotice.astro`, and the `progress.ts` client script**

The button should:

- read its `data-module-id`
- toggle completion in `localStorage`
- update `aria-pressed`
- dispatch a custom event so module rows and the continue-learning CTA can refresh
- remain disabled until the script confirms storage is available
- reveal `StorageNotice.astro` with the message `当前浏览器无法保存学习进度` when storage is unavailable

- [ ] **Step 5: Create the `continue-learning.ts` client script**

On load:

- read progress state
- compute the first incomplete module from the full ordered module list
- update the CTA `href`
- if all modules are complete, point to `/modules/`
- if storage is unavailable but JavaScript is running, point the CTA to the first module in the course and show the storage warning
- if JavaScript is unavailable, leave the fallback `href="/modules/"`

- [ ] **Step 6: Wire the progress UI into list rows and module detail pages**

`ModuleListItem.astro` should expose a completion badge placeholder.  
`src/pages/modules/[slug].astro` should render exactly one `CompletionToggle` near the top of the module page to keep the interface light.  
Render `StorageNotice.astro` on the home page, stage pages, module index, and module detail pages so the fallback message is visible anywhere progress state appears.

- [ ] **Step 7: Re-run the progress test**

Run: `npm run test -- tests/unit/progress.test.ts`  
Expected: PASS

- [ ] **Step 8: Verify the integrated site**

Run: `npm run build`  
Expected: PASS

- [ ] **Step 9: Commit if Git is available**

```bash
git add src/lib/progress.ts src/components/course/CompletionToggle.astro src/components/course/StorageNotice.astro src/scripts/progress.ts src/scripts/continue-learning.ts tests/unit/progress.test.ts src/components/course/ContinueLearningLink.astro src/components/course/ModuleListItem.astro src/pages/modules/[slug].astro src/pages/index.astro src/pages/stages/[slug].astro src/pages/modules/index.astro
git commit -m "feat: add learning progress persistence"
```

### Task 14: Run Final Verification and Responsive Polish

**Files:**
- Create: `tests/unit/content-coverage.test.ts`
- Create: `scripts/verify-links.mjs`
- Modify: `src/styles/global.css`
- Modify: `src/layouts/DocsLayout.astro`
- Modify: `src/components/site/Sidebar.astro`
- Modify: `src/components/course/StageCard.astro`
- Modify: `src/components/course/ModuleListItem.astro`
- Modify: `src/components/course/CompletionToggle.astro`
- Modify: `src/components/course/PagerNav.astro`
- Modify: `src/components/course/ContinueLearningLink.astro`

- [ ] **Step 1: Write the content coverage test**

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { modules } from '../../src/data/course/modules/index';
import { stages } from '../../src/data/course/stages';

function listMarkdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      return listMarkdownFiles(fullPath);
    }
    return fullPath.endsWith('.md') ? [fullPath] : [];
  });
}

function extractSection(source: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}\\n+([\\s\\S]*?)(\\n## |$)`));
  return match?.[1]?.trim() ?? '';
}

describe('content coverage', () => {
  it('keeps stage moduleIds, module metadata, and global order aligned', () => {
    const orderedIdsFromStages = stages.flatMap((stage) => stage.moduleIds);

    expect(modules).toHaveLength(42);
    expect(orderedIdsFromStages).toHaveLength(42);
    expect(modules.map((module) => module.id)).toEqual(orderedIdsFromStages);

    for (const module of modules) {
      const stage = stages.find((item) => item.id === module.stageId);
      expect(stage?.moduleIds).toContain(module.id);
      expect(module.number).toBe(module.id);
    }
  });

  it('keeps markdown content aligned with metadata ids', () => {
    const contentFiles = listMarkdownFiles('src/content/modules');
    const parsedModules = contentFiles
      .map((file) => readFileSync(file, 'utf8'))
      .map((source) => ({
        id: source.match(/^id:\s*["']?([^"'\n]+)["']?$/m)?.[1] ?? '',
        source
      }));
    const contentIds = parsedModules.map((item) => item.id).sort();
    const moduleIds = modules.map((module) => module.id).sort();

    expect(contentIds).toEqual(moduleIds);

    for (const item of parsedModules) {
      expect(extractSection(item.source, '## 为什么学这个').length).toBeGreaterThan(40);
      expect(extractSection(item.source, '## 核心知识').length).toBeGreaterThan(120);
      expect(extractSection(item.source, '## 关键对比 / 易错点').length).toBeGreaterThan(40);
      expect(extractSection(item.source, '## 学习检查点').length).toBeGreaterThan(20);
      expect(extractSection(item.source, '## 实践建议').length).toBeGreaterThan(20);
    }
  });
});
```

- [ ] **Step 2: Create the internal-link verification script**

```js
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');

function listHtmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(fullPath);
    return fullPath.endsWith('.html') ? [fullPath] : [];
  });
}

function resolveInternalHref(href) {
  const cleanHref = href.split('#')[0].split('?')[0];
  if (!cleanHref || cleanHref.startsWith('http') || cleanHref.startsWith('mailto:')) return null;
  const normalized = cleanHref === '/' ? '/index.html' : `${cleanHref.replace(/\/$/, '')}/index.html`;
  return join(distDir, normalized.replace(/^\//, ''));
}

const broken = [];
for (const file of listHtmlFiles(distDir)) {
  const html = readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    const target = resolveInternalHref(href);
    if (target && !existsSync(target)) {
      broken.push({ file, href, target });
    }
  }
}

if (broken.length > 0) {
  console.error('Broken internal links found:', broken);
  process.exit(1);
}
```

- [ ] **Step 3: Run the full unit test suite**

Run: `npm run test`  
Expected: PASS

- [ ] **Step 4: Run Astro checks, production build, and link verification**

Run: `npm run check && npm run build && node scripts/verify-links.mjs`  
Expected: PASS, with no broken internal links reported

- [ ] **Step 5: Manually verify the preview**

Run: `npm run preview`  
Check:

- home page has no sidebar
- module index sidebar shows stage list only
- stage and module pages expand the current stage in the sidebar
- `2.1` links back to `1.7`
- `5.8` links forward to `6.1`
- completion toggles persist after refresh
- the continue-learning CTA points to the first incomplete module

- [ ] **Step 6: Manually verify the storage-unavailable degradation path**

Use a browser mode or privacy setting that blocks `localStorage` and confirm:

- the storage warning text appears
- completion controls stay disabled
- the continue-learning CTA points to the first module in the course
- content pages remain readable

- [ ] **Step 7: Manually verify no-JavaScript degradation**

Disable JavaScript in the browser and confirm:

- content pages remain readable
- completion buttons no longer act interactive
- the continue-learning CTA falls back to `/modules/`

- [ ] **Step 8: Polish any responsive issues found during preview**

Focus only on issues that block readability, navigation, or button tap targets. Do not add new features during polish.

- [ ] **Step 9: Re-run the full verification after polish**

Run: `npm run test && npm run check && npm run build && node scripts/verify-links.mjs`  
Expected: PASS after the final responsive adjustments

- [ ] **Step 10: Commit the verified result if Git is available**

```bash
git add tests/unit/content-coverage.test.ts scripts/verify-links.mjs src/styles/global.css src/layouts/DocsLayout.astro src/components/site/Sidebar.astro src/components/course
git commit -m "chore: verify and polish learning site"
```
