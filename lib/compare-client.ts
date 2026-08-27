"use client";

const KEY = "pn_compare";
const MAX = 3;
const listeners = new Set<() => void>();

let cached: string[] = [];

function load(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

cached = load();

function write(ids: string[]) {
  cached = ids;
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  listeners.forEach((l) => l());
}

// Stable-reference snapshot getter: useSyncExternalStore requires the same
// reference back until the store actually changes, so we cache the array
// instead of re-parsing localStorage (and allocating a new array) on every call.
export function getCompareIds(): string[] {
  return cached;
}

const EMPTY_IDS: string[] = [];

export function getServerCompareIds(): string[] {
  return EMPTY_IDS;
}

export function toggleCompare(id: string): string[] {
  const ids = cached;
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= MAX ? ids : ids.concat(id);
  write(next);
  return next;
}

export function clearCompare() {
  write([]);
}

export function subscribeCompare(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
