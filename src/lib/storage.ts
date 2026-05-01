import { DEFAULT_POMO, DEFAULT_POMO_STATE, DEFAULT_STATS, type State } from "./types";
import { defaultSites } from "./presets";

const KEY = "jf:state";

export const defaultState = (): State => ({
  mode: "block",
  active: false,
  sites: defaultSites(),
  pomo: { ...DEFAULT_POMO },
  pomoState: { ...DEFAULT_POMO_STATE },
  theme: "system",
  redirectTone: "goggins",
  notifications: true,
  sound: true,
  seenOnboarding: false,
  stats: { ...DEFAULT_STATS },
});

export async function getState(): Promise<State> {
  const raw = await chrome.storage.local.get(KEY);
  const stored = raw[KEY] as Partial<State> | undefined;
  if (!stored) {
    const init = defaultState();
    await chrome.storage.local.set({ [KEY]: init });
    return init;
  }
  return { ...defaultState(), ...stored, pomo: { ...DEFAULT_POMO, ...(stored.pomo ?? {}) }, pomoState: { ...DEFAULT_POMO_STATE, ...(stored.pomoState ?? {}) }, stats: { ...DEFAULT_STATS, ...(stored.stats ?? {}) } };
}

export async function setState(patch: Partial<State>): Promise<State> {
  const current = await getState();
  const next: State = { ...current, ...patch };
  await chrome.storage.local.set({ [KEY]: next });
  return next;
}

export async function updateState(updater: (s: State) => State): Promise<State> {
  const current = await getState();
  const next = updater(current);
  await chrome.storage.local.set({ [KEY]: next });
  return next;
}

export function onStateChange(cb: (s: State) => void): () => void {
  const listener = (changes: { [k: string]: chrome.storage.StorageChange }, area: string) => {
    if (area !== "local" || !changes[KEY]) return;
    const next = changes[KEY].newValue as State | undefined;
    if (next) cb(next);
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}

export const STORAGE_KEY = KEY;
