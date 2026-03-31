import { afterEach, describe, expect, it } from 'vitest';
import {
  PROGRESS_STORAGE_KEY,
  canUseStorage,
  getFirstIncompleteModuleId,
  readProgress,
  toggleModule,
  writeProgress
} from '../../src/lib/progress';

type StorageMap = Map<string, string>;
type LocalStorageStub = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const testGlobal = globalThis as typeof globalThis & {
  window?: Window & typeof globalThis;
};
const originalWindow = testGlobal.window;

function setTestWindow(localStorage: LocalStorageStub) {
  Object.defineProperty(testGlobal, 'window', {
    configurable: true,
    writable: true,
    value: { localStorage }
  });
}

function createLocalStorageStub(seed: Record<string, string> = {}): {
  localStorage: LocalStorageStub;
  store: StorageMap;
} {
  const store = new Map(Object.entries(seed));

  return {
    localStorage: {
      getItem(key) {
        return store.get(key) ?? null;
      },
      setItem(key, value) {
        store.set(key, value);
      },
      removeItem(key) {
        store.delete(key);
      }
    },
    store
  };
}

afterEach(() => {
  if (originalWindow) {
    Object.defineProperty(testGlobal, 'window', {
      configurable: true,
      writable: true,
      value: originalWindow
    });
    return;
  }

  Reflect.deleteProperty(testGlobal, 'window');
});

describe('progress helpers', () => {
  it('returns the first incomplete module in global order', () => {
    expect(
      getFirstIncompleteModuleId(
        ['1.1', '1.2', '2.1'],
        { '1.1': true }
      )
    ).toBe('1.2');
  });

  it('returns null when all modules are complete', () => {
    expect(
      getFirstIncompleteModuleId(
        ['1.1', '1.2'],
        { '1.1': true, '1.2': true }
      )
    ).toBeNull();
  });

  it('toggles a module on and back off without mutating the original progress object', () => {
    const progress = { '1.1': true };
    const withSecondModule = toggleModule(progress, '1.2');
    const backToOriginalShape = toggleModule(withSecondModule, '1.2');

    expect(withSecondModule).toEqual({ '1.1': true, '1.2': true });
    expect(backToOriginalShape).toEqual({ '1.1': true });
    expect(progress).toEqual({ '1.1': true });
  });

  it('reads and writes sanitized progress through localStorage', () => {
    const { localStorage, store } = createLocalStorageStub();
    setTestWindow(localStorage);

    writeProgress({
      '1.1': true,
      '1.2': false,
      '1.3': 'yes' as unknown as boolean
    });

    expect(store.get(PROGRESS_STORAGE_KEY)).toBe('{"1.1":true,"1.2":false}');
    expect(readProgress()).toEqual({ '1.1': true, '1.2': false });
  });

  it('sanitizes malformed stored progress payloads', () => {
    const { localStorage } = createLocalStorageStub({
      [PROGRESS_STORAGE_KEY]: JSON.stringify({
        '1.1': true,
        '1.2': 'true',
        '1.3': 1,
        '1.4': false
      })
    });
    setTestWindow(localStorage);

    expect(readProgress()).toEqual({ '1.1': true, '1.4': false });
  });

  it('reports storage unavailable when localStorage operations throw', () => {
    setTestWindow({
      getItem() {
        throw new Error('blocked');
      },
      setItem() {
        throw new Error('blocked');
      },
      removeItem() {
        throw new Error('blocked');
      }
    });

    expect(canUseStorage()).toBe(false);
    expect(readProgress()).toEqual({});
  });
});
