import { readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { modules } from '../../src/data/course/modules';
import { stages } from '../../src/data/course/stages';
import { getCourseModulesInOrder, getStageModules } from '../../src/lib/course';

const CONTENT_ROOT = resolve(process.cwd(), 'src/content/modules');
const REQUIRED_SECTIONS = [
  '为什么学这个',
  '核心知识',
  '关键对比 / 易错点',
  '学习检查点',
  '实践建议'
] as const;

type MarkdownModule = {
  filePath: string;
  frontmatterId: string;
  body: string;
};

function walkMarkdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const nextPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        return walkMarkdownFiles(nextPath);
      }

      return entry.isFile() && extname(entry.name) === '.md' ? [nextPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function parseMarkdownModule(filePath: string): MarkdownModule {
  const source = readFileSync(filePath, 'utf8');
  const frontmatterMatch = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);

  expect(frontmatterMatch, `Expected frontmatter in ${filePath}`).not.toBeNull();

  const frontmatter = frontmatterMatch?.[1] ?? '';
  const frontmatterIdMatch = frontmatter.match(/(?:^|\n)id:\s*["']([^"']+)["']/);

  expect(frontmatterIdMatch, `Expected frontmatter id in ${filePath}`).not.toBeNull();

  return {
    filePath,
    frontmatterId: frontmatterIdMatch?.[1] ?? '',
    body: source.slice(frontmatterMatch?.[0].length ?? 0).trim()
  };
}

function getLevelTwoSections(body: string) {
  const headingMatches = [...body.matchAll(/^##\s+(.+)\s*$/gm)];
  const sections = new Map<string, string>();

  for (const [index, headingMatch] of headingMatches.entries()) {
    const heading = headingMatch[1]?.trim() ?? '';
    const sectionStart = headingMatch.index! + headingMatch[0].length;
    const nextHeadingIndex = headingMatches[index + 1]?.index ?? body.length;
    const content = body.slice(sectionStart, nextHeadingIndex).trim();

    sections.set(heading, content);
  }

  return sections;
}

function getSignalLength(content: string) {
  return content.replace(/[`*_>#\-\[\]\(\)!|]/g, '').replace(/\s+/g, '').length;
}

describe('course content coverage', () => {
  const markdownModules = walkMarkdownFiles(CONTENT_ROOT).map(parseMarkdownModule);
  const stageModuleIds = stages.flatMap((stage) => stage.moduleIds);
  const moduleIds = modules.map((module) => module.id);
  const orderedModuleIds = getCourseModulesInOrder(stages, modules).map((module) => module.id);
  const markdownIds = markdownModules.map((entry) => entry.frontmatterId);

  it('keeps stage moduleIds, module metadata, and course ordering aligned', () => {
    expect(stages).toHaveLength(6);
    expect(stageModuleIds).toHaveLength(42);
    expect(modules).toHaveLength(42);
    expect(new Set(stageModuleIds).size).toBe(stageModuleIds.length);
    expect(new Set(moduleIds).size).toBe(moduleIds.length);
    expect(stageModuleIds).toEqual(moduleIds);
    expect(moduleIds).toEqual(orderedModuleIds);

    const stageIds = new Set(stages.map((stage) => stage.id));

    for (const stage of stages) {
      expect(getStageModules(stages, modules, stage.id).map((module) => module.id)).toEqual(stage.moduleIds);
    }

    for (const module of modules) {
      expect(stageIds.has(module.stageId), `${module.id} points to missing stage ${module.stageId}`).toBe(true);

      const parentStage = stages.find((stage) => stage.id === module.stageId);
      expect(parentStage?.moduleIds.includes(module.id), `${module.id} missing from stage ${module.stageId}`).toBe(true);
    }
  });

  it('keeps markdown content ids aligned with metadata ids', () => {
    expect(markdownModules).toHaveLength(42);
    expect(new Set(markdownIds).size).toBe(markdownIds.length);
    expect(markdownIds).toEqual(moduleIds);

    for (const markdownModule of markdownModules) {
      const fileName = basename(markdownModule.filePath);
      const expectedPrefix = `${markdownModule.frontmatterId.replace('.', '-')}-`;

      expect(
        fileName.startsWith(expectedPrefix),
        `${fileName} should start with ${expectedPrefix}`
      ).toBe(true);
    }
  });

  it('keeps every module page populated with the required non-trivial sections', () => {
    for (const markdownModule of markdownModules) {
      const sections = getLevelTwoSections(markdownModule.body);

      for (const heading of REQUIRED_SECTIONS) {
        const content = sections.get(heading);

        expect(content, `${markdownModule.filePath} is missing section "${heading}"`).toBeTruthy();
        expect(
          getSignalLength(content ?? ''),
          `${markdownModule.filePath} section "${heading}" is too short`
        ).toBeGreaterThanOrEqual(30);
      }
    }
  });
});
