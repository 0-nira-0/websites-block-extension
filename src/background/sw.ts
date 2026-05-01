import { applyRules, clearRules } from "../lib/rules";
import { getState, setState, updateState } from "../lib/storage";
import type { Msg } from "../lib/messages";
import type { State } from "../lib/types";

async function syncRules(state: State): Promise<void> {
  const blockingActive = state.active && (state.mode === "block" || state.pomoState.phase === "focus");
  if (blockingActive) {
    await applyRules(state.sites);
  } else {
    await clearRules();
  }
}

async function activate(): Promise<void> {
  const state = await setState({ active: true });
  await syncRules(state);
}

async function deactivate(): Promise<void> {
  const state = await updateState((s) => ({
    ...s,
    active: false,
    pomoState: { phase: "idle", round: 0, endsAt: null, paused: false, remaining: null },
  }));
  await chrome.alarms.clear("pomo");
  await syncRules(state);
}

chrome.runtime.onInstalled.addListener(async () => {
  const state = await getState();
  await syncRules(state);
});

chrome.runtime.onStartup.addListener(async () => {
  const state = await getState();
  if (!state.active) await clearRules();
  else await syncRules(state);
});

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "local" || !changes["jf:state"]) return;
  const next = changes["jf:state"].newValue as State | undefined;
  const prev = changes["jf:state"].oldValue as State | undefined;
  if (!next) return;
  const sitesChanged = JSON.stringify(prev?.sites) !== JSON.stringify(next.sites);
  if (sitesChanged && next.active) {
    await syncRules(next);
  }
});

chrome.runtime.onMessage.addListener((msg: Msg, _sender, sendResponse) => {
  (async () => {
    if (msg.type === "ACTIVATE") {
      await activate();
      sendResponse({ ok: true });
    } else if (msg.type === "DEACTIVATE") {
      await deactivate();
      sendResponse({ ok: true });
    } else if (msg.type === "SYNC_RULES") {
      const s = await getState();
      await syncRules(s);
      sendResponse({ ok: true });
    } else {
      sendResponse({ ok: true });
    }
  })().catch(() => sendResponse({ ok: false }));
  return true;
});
