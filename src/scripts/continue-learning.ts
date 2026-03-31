import { getFirstIncompleteModuleId, canUseStorage, readProgress } from '../lib/progress';
import { PROGRESS_UPDATED_EVENT, syncStorageNotices } from './progress';

type CourseModuleLink = {
  id: string;
  href: string;
};

function parseCourseModules(value: string | undefined) {
  if (!value) {
    return [] as CourseModuleLink[];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [] as CourseModuleLink[];
    }

    return parsed.filter(
      (entry): entry is CourseModuleLink =>
        Boolean(entry) &&
        typeof entry === 'object' &&
        typeof entry.id === 'string' &&
        typeof entry.href === 'string'
    );
  } catch {
    return [] as CourseModuleLink[];
  }
}

function refreshContinueLearningLinks() {
  for (const element of document.querySelectorAll('[data-continue-learning-link]')) {
    if (!(element instanceof HTMLAnchorElement)) {
      continue;
    }

    const courseModules = parseCourseModules(element.dataset.courseModules);
    const firstModuleHref = courseModules[0]?.href ?? '/modules/';

    if (!canUseStorage()) {
      element.href = firstModuleHref;
      syncStorageNotices(false);
      continue;
    }

    const progress = readProgress();
    const firstIncompleteModuleId = getFirstIncompleteModuleId(
      courseModules.map((module) => module.id),
      progress
    );
    const nextModule = courseModules.find((module) => module.id === firstIncompleteModuleId) ?? null;

    element.href = nextModule?.href ?? '/modules/';
    syncStorageNotices(true);
  }
}

export function initContinueLearning() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  refreshContinueLearningLinks();

  const root = document.documentElement;
  if (root.dataset.continueLearningInitialized === 'true') {
    return;
  }

  root.dataset.continueLearningInitialized = 'true';
  window.addEventListener(PROGRESS_UPDATED_EVENT, refreshContinueLearningLinks);
}
