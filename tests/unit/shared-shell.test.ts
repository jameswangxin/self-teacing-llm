import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf8');

describe('shared shell ownership and accessibility', () => {
  it('keeps nav model ownership in DocsLayout instead of rebuilding it in TopNav', () => {
    const layoutSource = readSource('src/layouts/DocsLayout.astro');
    const topNavSource = readSource('src/components/site/TopNav.astro');

    expect(layoutSource).toContain('<TopNav currentPath={currentPath} model={navModel} />');
    expect(topNavSource).not.toContain('buildSidebarModel');
    expect(topNavSource).not.toContain("from '../../data/course/modules'");
    expect(topNavSource).not.toContain("from '../../data/course/stages'");
  });

  it('includes modal focus-management hooks for the mobile drawer', () => {
    const drawerSource = readSource('src/components/site/NavDrawerToggle.astro');
    const layoutSource = readSource('src/layouts/DocsLayout.astro');

    expect(drawerSource).toContain('data-drawer-close-panel');
    expect(drawerSource).toContain('data-drawer-focus-start');
    expect(drawerSource).toContain('data-drawer-focus-end');
    expect(drawerSource).toContain('inert');
    expect(layoutSource).toContain('data-nav-main');
  });

  it('wires the module index page to the stage-only sidebar model', () => {
    const moduleIndexSource = readSource('src/pages/modules/index.astro');

    expect(moduleIndexSource).toContain("buildSidebarModel(stages, modules, 'module-index')");
    expect(moduleIndexSource).not.toContain('全部 6 个阶段');
    expect(moduleIndexSource).toContain('{stages.length} 个阶段');
  });

  it('wires the stage page to course helpers and stage navigation components', () => {
    const stagePageSource = readSource('src/pages/stages/[slug].astro');

    expect(stagePageSource).toContain('getStaticPaths');
    expect(stagePageSource).toContain('getStageModules');
    expect(stagePageSource).toContain("buildSidebarModel(stages, modules, 'stage', stage.id)");
    expect(stagePageSource).toContain('<ModuleListItem');
    expect(stagePageSource).toContain('<StageProjectCard');
    expect(stagePageSource).toContain('<StagePager');
  });

  it('wires the module page to metadata-driven paths, merged content, and module navigation', () => {
    const modulePageSource = readSource('src/pages/modules/[slug].astro');

    expect(modulePageSource).toContain('getCollection(\'modules\')');
    expect(modulePageSource).toContain('return modules.map((module) => ({');
    expect(modulePageSource).toContain('getRenderableModule');
    expect(modulePageSource).toContain('getCourseModulesInOrder');
    expect(modulePageSource).toContain("buildSidebarModel(stages, modules, 'module', stage.id, renderableModule.id)");
    expect(modulePageSource).toContain('<MissingContentNotice stageHref={`/stages/${stage.slug}/`} modulesHref="/modules/" />');
    expect(modulePageSource).toContain('<StageProjectCard');
    expect(modulePageSource).toContain('<PagerNav');
    expect(modulePageSource).toContain('<ul class="module-page-keypoints">');
    expect(modulePageSource).toContain('<li class="module-page-keypoints__item">');
  });

  it('keeps progress bootstrap separate from the storage notice component', () => {
    const storageNoticeSource = readSource('src/components/course/StorageNotice.astro');
    const modulePageSource = readSource('src/pages/modules/[slug].astro');
    const stagePageSource = readSource('src/pages/stages/[slug].astro');
    const moduleIndexSource = readSource('src/pages/modules/index.astro');

    expect(storageNoticeSource).not.toContain('initProgressUI');
    expect(modulePageSource).toContain('<ProgressBootstrap />');
    expect(stagePageSource).toContain('<ProgressBootstrap />');
    expect(moduleIndexSource).toContain('<ProgressBootstrap />');
  });

  it('keeps completion toggle semantics stable when using aria-pressed', () => {
    const toggleSource = readSource('src/components/course/CompletionToggle.astro');

    expect(toggleSource).toContain('aria-pressed="false"');
    expect(toggleSource).toContain('aria-label="切换当前模块完成状态"');
  });

  it('adds an explicit current-module styling hook in the sidebar', () => {
    const sidebarSource = readSource('src/components/site/Sidebar.astro');

    expect(sidebarSource).toContain('docs-sidebar__module--current');
    expect(sidebarSource).toContain("const canLinkModules = model.pageType === 'module';");
    expect(sidebarSource).toContain('canLinkModules && module.href');
  });

  it('lets the missing-content notice render actionable recovery links when context is available', () => {
    const noticeSource = readSource('src/components/content/MissingContentNotice.astro');

    expect(noticeSource).toContain('stageHref');
    expect(noticeSource).toContain('modulesHref');
    expect(noticeSource).toContain('返回阶段页');
    expect(noticeSource).toContain('查看模块索引');
  });
});
