import type { CourseModule, CourseStage } from '../data/course/schema';

export type SidebarPageType = 'home' | 'module-index' | 'modules' | 'stage' | 'module';

type StageLike = Omit<CourseStage, 'moduleIds'> & {
  moduleIds: ReadonlyArray<string>;
};
type ModuleLike = {
  id: string;
  stageId: string;
  slug?: string;
  title?: string;
};
type ContentEntryLike = {
  data: {
    id: string;
  };
};

export type StageModuleGroup<T extends ModuleLike, S extends StageLike = CourseStage> = {
  stageId: string;
  stage: S | null;
  modules: T[];
};
export type RenderableModule<
  TModule extends ModuleLike = CourseModule,
  TEntry extends ContentEntryLike = ContentEntryLike
> = TModule & {
  contentEntry: TEntry | null;
};

export type SidebarItem<S extends StageLike> = {
  stage: S;
  href: string;
  isCurrent: boolean;
  isExpanded: boolean;
  modules: Array<{
    id: string;
    title: string | null;
    slug: string | null;
    href: string | null;
    isCurrent: boolean;
  }>;
};

export type SidebarModel<S extends StageLike> = {
  pageType: SidebarPageType;
  items: SidebarItem<S>[];
};

function orderStageModules<T extends ModuleLike, S extends StageLike>(
  stage: S | null,
  moduleList: ReadonlyArray<T>
): T[] {
  if (!stage) {
    return [...moduleList];
  }

  const modulesById = new Map(moduleList.map((module) => [module.id, module] as const));
  const orderedModules: T[] = [];

  for (const moduleId of stage.moduleIds) {
    const module = modulesById.get(moduleId);
    if (!module) {
      continue;
    }

    orderedModules.push(module);
    modulesById.delete(moduleId);
  }

  for (const module of moduleList) {
    if (!modulesById.has(module.id)) {
      continue;
    }

    orderedModules.push(module);
    modulesById.delete(module.id);
  }

  return orderedModules;
}

export function getAdjacentModuleIds(
  moduleList: ReadonlyArray<{ id: string }>,
  currentId: string
) {
  const index = moduleList.findIndex((module) => module.id === currentId);

  return {
    prevId: index > 0 ? moduleList[index - 1].id : null,
    nextId: index >= 0 && index < moduleList.length - 1 ? moduleList[index + 1].id : null
  };
}

export function getCourseModulesInOrder<T extends ModuleLike, S extends StageLike>(
  stageList: ReadonlyArray<S>,
  moduleList: ReadonlyArray<T>
): T[] {
  const modulesById = new Map(moduleList.map((module) => [module.id, module] as const));
  const orderedModules: T[] = [];

  for (const stage of stageList) {
    for (const moduleId of stage.moduleIds) {
      const module = modulesById.get(moduleId);

      if (!module) {
        continue;
      }

      orderedModules.push(module);
      modulesById.delete(moduleId);
    }
  }

  for (const module of moduleList) {
    if (!modulesById.has(module.id)) {
      continue;
    }

    orderedModules.push(module);
    modulesById.delete(module.id);
  }

  return orderedModules;
}

export function mapContentEntriesById<TEntry extends ContentEntryLike>(entries: ReadonlyArray<TEntry>) {
  return new Map(entries.map((entry) => [entry.data.id, entry] as const));
}

export function groupModulesByStage<T extends ModuleLike, S extends StageLike>(
  stageList: ReadonlyArray<S>,
  moduleList: ReadonlyArray<T>
): StageModuleGroup<T, S>[] {
  const modulesByStage = new Map<string, T[]>();

  for (const module of moduleList) {
    const existingModules = modulesByStage.get(module.stageId);
    if (existingModules) {
      existingModules.push(module);
      continue;
    }

    modulesByStage.set(module.stageId, [module]);
  }

  const groups: StageModuleGroup<T, S>[] = [];

  for (const stage of stageList) {
    const stageModules = modulesByStage.get(stage.id);
    if (!stageModules) {
      continue;
    }

    groups.push({
      stageId: stage.id,
      stage,
      modules: orderStageModules(stage, stageModules)
    });
    modulesByStage.delete(stage.id);
  }

  for (const [stageId, stageModules] of modulesByStage.entries()) {
    groups.push({
      stageId,
      stage: null,
      modules: [...stageModules]
    });
  }

  return groups;
}

export function getStageBySlug<S extends StageLike>(stageList: ReadonlyArray<S>, slug: string): S | null {
  return stageList.find((stage) => stage.slug === slug) ?? null;
}

export function getModuleBySlug<T extends ModuleLike>(
  moduleList: ReadonlyArray<T>,
  slug: string
): T | null {
  return moduleList.find((module) => module.slug === slug) ?? null;
}

export function getRenderableModule<TModule extends ModuleLike, TEntry extends ContentEntryLike>(
  moduleList: ReadonlyArray<TModule>,
  slug: string,
  entries: ReadonlyArray<TEntry>
): RenderableModule<TModule, TEntry> | null {
  const module = getModuleBySlug(moduleList, slug);

  if (!module) {
    return null;
  }

  const contentEntriesById = mapContentEntriesById(entries);

  return {
    ...module,
    contentEntry: contentEntriesById.get(module.id) ?? null
  };
}

export function getStageModules<T extends ModuleLike, S extends StageLike>(
  stageList: ReadonlyArray<S>,
  moduleList: ReadonlyArray<T>,
  stageId: string
): T[] {
  const stage = stageList.find((candidate) => candidate.id === stageId) ?? null;
  const stageModules = moduleList.filter((module) => module.stageId === stageId);

  return orderStageModules(stage, stageModules);
}

export function buildSidebarModel<T extends ModuleLike, S extends StageLike>(
  stageList: ReadonlyArray<S>,
  moduleList: ReadonlyArray<T>,
  pageType: SidebarPageType,
  currentStageId?: string,
  currentModuleId?: string
): SidebarModel<S> {
  if (pageType === 'home') {
    return { pageType, items: [] };
  }

  const stageOnlyPage = pageType === 'module-index' || pageType === 'modules';

  return {
    pageType,
    items: stageList.map((stage) => {
      const stageModules = stageOnlyPage ? [] : getStageModules(stageList, moduleList, stage.id);

      return {
        stage,
        href: `/stages/${stage.slug}/`,
        isCurrent: stage.id === currentStageId,
        isExpanded: !stageOnlyPage && stage.id === currentStageId,
        modules: stageModules.map((module) => ({
          id: module.id,
          title: module.title ?? null,
          slug: module.slug ?? null,
          href: module.slug ? `/modules/${module.slug}/` : null,
          isCurrent: module.id === currentModuleId
        }))
      };
    })
  };
}
