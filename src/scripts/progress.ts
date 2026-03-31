import { canUseStorage, readProgress, toggleModule, writeProgress } from '../lib/progress';

export const PROGRESS_UPDATED_EVENT = 'self-teaching-llm:progress-updated';

function syncToggleState(button: HTMLButtonElement, progress: Record<string, boolean>, storageAvailable: boolean) {
  const moduleId = button.dataset.moduleId;
  const label = button.querySelector('[data-completion-toggle-label]');
  const hint = button.querySelector('[data-completion-toggle-hint]');

  if (!moduleId) {
    return;
  }

  if (!storageAvailable) {
    button.disabled = true;
    button.dataset.complete = 'false';
    button.setAttribute('aria-pressed', 'false');

    if (label instanceof HTMLElement) {
      label.textContent = '无法保存学习进度';
    }

    if (hint instanceof HTMLElement) {
      hint.textContent = '请检查浏览器的本地存储权限';
    }

    return;
  }

  const isComplete = Boolean(progress[moduleId]);

  button.disabled = false;
  button.dataset.complete = isComplete ? 'true' : 'false';
  button.setAttribute('aria-pressed', isComplete ? 'true' : 'false');

  if (label instanceof HTMLElement) {
    label.textContent = isComplete ? '已完成本模块' : '标记为已完成';
  }

  if (hint instanceof HTMLElement) {
    hint.textContent = isComplete ? '点击后将取消完成状态' : '将在当前浏览器保存学习进度';
  }
}

function syncCompletionBadges(progress: Record<string, boolean>, storageAvailable: boolean) {
  for (const row of document.querySelectorAll('[data-module-progress-row]')) {
    if (!(row instanceof HTMLElement)) {
      continue;
    }

    const moduleId = row.dataset.moduleId;
    const isComplete = Boolean(storageAvailable && moduleId && progress[moduleId]);

    row.dataset.complete = isComplete ? 'true' : 'false';
  }

  for (const badge of document.querySelectorAll('[data-module-progress-badge]')) {
    if (!(badge instanceof HTMLElement)) {
      continue;
    }

    const moduleId = badge.dataset.moduleId;
    const isComplete = Boolean(storageAvailable && moduleId && progress[moduleId]);

    badge.hidden = !isComplete;
    badge.textContent = '已完成';
  }
}

export function syncStorageNotices(storageAvailable: boolean) {
  for (const notice of document.querySelectorAll('[data-storage-notice]')) {
    if (notice instanceof HTMLElement) {
      notice.hidden = storageAvailable;
    }
  }
}

function refreshProgressUI() {
  const storageAvailable = canUseStorage();
  const progress = storageAvailable ? readProgress() : {};

  syncStorageNotices(storageAvailable);
  syncCompletionBadges(progress, storageAvailable);

  for (const button of document.querySelectorAll('[data-completion-toggle]')) {
    if (button instanceof HTMLButtonElement) {
      syncToggleState(button, progress, storageAvailable);
    }
  }
}

function dispatchProgressUpdated() {
  window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT));
}

function bindCompletionToggles() {
  for (const button of document.querySelectorAll('[data-completion-toggle]')) {
    if (!(button instanceof HTMLButtonElement) || button.dataset.bound === 'true') {
      continue;
    }

    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const moduleId = button.dataset.moduleId;

      if (!moduleId || !canUseStorage()) {
        refreshProgressUI();
        return;
      }

      const nextProgress = toggleModule(readProgress(), moduleId);
      writeProgress(nextProgress);
      refreshProgressUI();
      dispatchProgressUpdated();
    });
  }
}

export function initProgressUI() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  bindCompletionToggles();
  refreshProgressUI();

  if (root.dataset.progressUiInitialized === 'true') {
    return;
  }

  root.dataset.progressUiInitialized = 'true';
  window.addEventListener(PROGRESS_UPDATED_EVENT, refreshProgressUI);
}
