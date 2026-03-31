export const PROGRESS_STORAGE_KEY = 'self-teaching-llm-progress-v1';

function sanitizeProgress(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean')
  );
}

export function canUseStorage() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const testKey = `${PROGRESS_STORAGE_KEY}:test`;
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function readProgress() {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const rawProgress = window.localStorage.getItem(PROGRESS_STORAGE_KEY);

    if (!rawProgress) {
      return {};
    }

    return sanitizeProgress(JSON.parse(rawProgress));
  } catch {
    return {};
  }
}

export function writeProgress(nextProgress: Record<string, boolean>) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(sanitizeProgress(nextProgress)));
}

export function toggleModule(progress: Record<string, boolean>, moduleId: string) {
  const nextProgress = { ...progress };

  if (nextProgress[moduleId]) {
    delete nextProgress[moduleId];
    return nextProgress;
  }

  nextProgress[moduleId] = true;
  return nextProgress;
}

export function getFirstIncompleteModuleId(
  orderedIds: string[],
  progress: Record<string, boolean>
) {
  return orderedIds.find((id) => !progress[id]) ?? null;
}
