import { describe, expect, it } from 'vitest';
import {
  buildSidebarModel,
  getCourseModulesInOrder,
  getAdjacentModuleIds,
  getRenderableModule,
  groupModulesByStage,
  mapContentEntriesById
} from '../../src/lib/course';

describe('course helpers', () => {
  it('links modules across stage boundaries', () => {
    const stageList = [
      {
        id: 'ai-engineering-foundation',
        number: '1',
        title: 'AI 工程基础',
        slug: 'ai-engineering-foundation',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['1.7']
      },
      {
        id: 'rag-fundamentals',
        number: '2',
        title: 'RAG 核心原理',
        slug: 'rag-fundamentals',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['2.1', '2.2']
      }
    ] as const;

    const moduleList = [
      { id: '1.7', stageId: 'ai-engineering-foundation' },
      { id: '2.1', stageId: 'rag-fundamentals' },
      { id: '2.2', stageId: 'rag-fundamentals' }
    ] as const;

    expect(getAdjacentModuleIds(moduleList, '2.1')).toEqual({
      prevId: '1.7',
      nextId: '2.2'
    });

    expect(groupModulesByStage(stageList, moduleList)).toEqual([
      {
        stageId: 'ai-engineering-foundation',
        stage: stageList[0],
        modules: [{ id: '1.7', stageId: 'ai-engineering-foundation' }]
      },
      {
        stageId: 'rag-fundamentals',
        stage: stageList[1],
        modules: [
          { id: '2.1', stageId: 'rag-fundamentals' },
          { id: '2.2', stageId: 'rag-fundamentals' }
        ]
      }
    ]);
  });

  it('orders grouped modules by stage moduleIds instead of input order', () => {
    const stageList = [
      {
        id: 'rag-fundamentals',
        number: '2',
        title: 'RAG 核心原理',
        slug: 'rag-fundamentals',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['2.1', '2.2', '2.3']
      }
    ] as const;

    const moduleList = [
      { id: '2.3', stageId: 'rag-fundamentals', slug: 'chunking', title: 'Chunking' },
      { id: '2.1', stageId: 'rag-fundamentals', slug: 'why-rag', title: 'Why RAG' }
    ] as const;

    expect(groupModulesByStage(stageList, moduleList)).toEqual([
      {
        stageId: 'rag-fundamentals',
        stage: stageList[0],
        modules: [
          { id: '2.1', stageId: 'rag-fundamentals', slug: 'why-rag', title: 'Why RAG' },
          { id: '2.3', stageId: 'rag-fundamentals', slug: 'chunking', title: 'Chunking' }
        ]
      }
    ]);
  });

  it('derives the canonical full-course module order from stage moduleIds', () => {
    const stageList = [
      {
        id: 'stage-1',
        number: '1',
        title: 'Stage 1',
        slug: 'stage-1',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['1.1', '1.2']
      },
      {
        id: 'stage-2',
        number: '2',
        title: 'Stage 2',
        slug: 'stage-2',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['2.1', '2.2']
      }
    ] as const;

    const moduleList = [
      { id: '2.2', stageId: 'stage-2', slug: 'two-two', title: 'Two Two' },
      { id: '1.2', stageId: 'stage-1', slug: 'one-two', title: 'One Two' },
      { id: '2.1', stageId: 'stage-2', slug: 'two-one', title: 'Two One' },
      { id: '1.1', stageId: 'stage-1', slug: 'one-one', title: 'One One' }
    ] as const;

    expect(getCourseModulesInOrder(stageList, moduleList).map((module) => module.id)).toEqual([
      '1.1',
      '1.2',
      '2.1',
      '2.2'
    ]);

    expect(
      getAdjacentModuleIds(getCourseModulesInOrder(stageList, moduleList), '2.1')
    ).toEqual({
      prevId: '1.2',
      nextId: '2.2'
    });
  });

  it('tolerates partial module sets when deriving the course order', () => {
    const stageList = [
      {
        id: 'stage-1',
        number: '1',
        title: 'Stage 1',
        slug: 'stage-1',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['1.1', '1.2']
      },
      {
        id: 'stage-2',
        number: '2',
        title: 'Stage 2',
        slug: 'stage-2',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['2.1']
      }
    ] as const;

    const moduleList = [
      { id: '2.1', stageId: 'stage-2', slug: 'two-one', title: 'Two One' },
      { id: '1.2', stageId: 'stage-1', slug: 'one-two', title: 'One Two' }
    ] as const;

    expect(getCourseModulesInOrder(stageList, moduleList).map((module) => module.id)).toEqual([
      '1.2',
      '2.1'
    ]);
  });

  it('builds a stage-only sidebar model for the module index page', () => {
    const stageList = [
      {
        id: 'ai-engineering-foundation',
        number: '1',
        title: 'AI 工程基础',
        slug: 'ai-engineering-foundation',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['1.1']
      }
    ] as const;

    const moduleList = [
      { id: '1.1', stageId: 'ai-engineering-foundation', slug: 'what-is-an-llm', title: 'LLM 到底是什么' }
    ] as const;

    expect(buildSidebarModel(stageList, moduleList, 'module-index')).toEqual({
      pageType: 'module-index',
      items: [
        {
          stage: stageList[0],
          href: '/stages/ai-engineering-foundation/',
          isCurrent: false,
          isExpanded: false,
          modules: []
        }
      ]
    });
  });

  it('expands the current stage and marks the current module on module pages', () => {
    const stageList = [
      {
        id: 'ai-engineering-foundation',
        number: '1',
        title: 'AI 工程基础',
        slug: 'ai-engineering-foundation',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['1.1', '1.2']
      },
      {
        id: 'rag-fundamentals',
        number: '2',
        title: 'RAG 核心原理',
        slug: 'rag-fundamentals',
        goal: 'goal',
        summary: 'summary',
        project: 'project',
        moduleIds: ['2.1']
      }
    ] as const;

    const moduleList = [
      { id: '1.2', stageId: 'ai-engineering-foundation', slug: 'tokens-and-context-windows', title: 'Token 与上下文窗口' },
      { id: '2.1', stageId: 'rag-fundamentals', slug: 'why-rag', title: 'Why RAG' },
      { id: '1.1', stageId: 'ai-engineering-foundation', slug: 'what-is-an-llm', title: 'LLM 到底是什么' }
    ] as const;

    expect(
      buildSidebarModel(
        stageList,
        moduleList,
        'module',
        'ai-engineering-foundation',
        '1.2'
      )
    ).toEqual({
      pageType: 'module',
      items: [
        {
          stage: stageList[0],
          href: '/stages/ai-engineering-foundation/',
          isCurrent: true,
          isExpanded: true,
          modules: [
            {
              id: '1.1',
              title: 'LLM 到底是什么',
              slug: 'what-is-an-llm',
              href: '/modules/what-is-an-llm/',
              isCurrent: false
            },
            {
              id: '1.2',
              title: 'Token 与上下文窗口',
              slug: 'tokens-and-context-windows',
              href: '/modules/tokens-and-context-windows/',
              isCurrent: true
            }
          ]
        },
        {
          stage: stageList[1],
          href: '/stages/rag-fundamentals/',
          isCurrent: false,
          isExpanded: false,
          modules: [
            {
              id: '2.1',
              title: 'Why RAG',
              slug: 'why-rag',
              href: '/modules/why-rag/',
              isCurrent: false
            }
          ]
        }
      ]
    });
  });

  it('maps content entries by module id from frontmatter', () => {
    const entries = [
      {
        id: 'stage-1/1-1-what-is-an-llm.md',
        body: '## 为什么学这个',
        data: { id: '1.1' }
      },
      {
        id: 'stage-1/1-2-tokens-and-context-windows.md',
        body: '## Token 与上下文窗口',
        data: { id: '1.2' }
      }
    ] as const;

    expect(mapContentEntriesById(entries)).toEqual(
      new Map<string, (typeof entries)[number]>([
        ['1.1', entries[0]],
        ['1.2', entries[1]]
      ])
    );
  });

  it('merges module metadata with markdown entries for renderable module pages', () => {
    const moduleList = [
      {
        id: '1.1',
        number: '1.1',
        title: '什么是 LLM',
        slug: 'what-is-an-llm',
        stageId: 'ai-engineering-foundation',
        summary: '建立 LLM 的基本直觉',
        estimatedTime: '25 分钟',
        prerequisites: [],
        keyPoints: ['预测下一个 token', '训练与推理', '能力边界']
      },
      {
        id: '1.2',
        number: '1.2',
        title: 'Token 与上下文窗口',
        slug: 'tokens-and-context-windows',
        stageId: 'ai-engineering-foundation',
        summary: '理解 token 与窗口限制',
        estimatedTime: '20 分钟',
        prerequisites: ['1.1'],
        keyPoints: ['token', 'context window', '截断']
      }
    ] as const;

    const entries = [
      {
        id: 'stage-1/1-1-what-is-an-llm.md',
        body: '## 为什么学这个',
        data: { id: '1.1' }
      }
    ] as const;

    expect(getRenderableModule(moduleList, 'what-is-an-llm', entries)).toEqual({
      ...moduleList[0],
      contentEntry: entries[0]
    });

    expect(getRenderableModule(moduleList, 'tokens-and-context-windows', entries)).toEqual({
      ...moduleList[1],
      contentEntry: null
    });

    expect(getRenderableModule(moduleList, 'missing-module', entries)).toBeNull();
  });
});
