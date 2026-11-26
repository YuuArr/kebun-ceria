const PREFIX = 'kc:';

/** Reads a JSON value; returns `fallback` when missing, corrupt or storage is unavailable. */
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Writes a JSON value; returns false when storage is unavailable (e.g. private mode). */
export function saveJSON(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
