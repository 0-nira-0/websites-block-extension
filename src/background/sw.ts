import { applyRules, clearRules } from "../lib/rules";
import { getState, setState, updateState } from "../lib/storage";
import type { Msg } from "../lib/messages";
import type { Phase, Site, State } from "../lib/types";

const ALARM = "pomo";

function normalizeHost(raw: string): string {
  let v = raw.trim().toLowerCase();
  v = v.replace(/^https?:\/\//, "");
  v = v.replace(/^www\./, "");
  v = v.replace(/[\/?#].*$/, "");
  return v;
}

function blockedHostFor(url: string, sites: Site[]): string | null {
  let host = "";
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    host = u.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
  } catch {
    return null;
  }
  for (const s of sites) {
    if (!s.enabled || !s.url) continue;
    const target = normalizeHost(s.url);
    if (!target) continue;
    if (host === target || host.endsWith(`.${target}`)) return target;
  }
  return null;
}

function redirectTargetFor(host: string): string {
  return `${chrome.runtime.getURL("src/redirect/index.html")}?host=${encodeURIComponent(host)}`;
}

async function syncRules(state: State): Promise<void> {
  const blockingActive = state.active && (state.mode === "block" || state.pomoState.phase === "focus");
  if (blockingActive) {
    await applyRules(state.sites);
  } else {
    await clearRules();
  }
}

function phaseDurationMs(state: State, phase: Phase): number {
  if (phase === "focus") return state.pomo.focus * 60_000;
  if (phase === "short") return state.pomo.short * 60_000;
  if (phase === "long") return state.pomo.long * 60_000;
  return 0;
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
  await chrome.alarms.clear(ALARM);
  await syncRules(state);
}

async function startPomodoro(): Promise<void> {
  const state = await updateState((s) => {
    const endsAt = Date.now() + s.pomo.focus * 60_000;
    return {
      ...s,
      mode: "pomodoro",
      active: true,
      pomoState: { phase: "focus", round: 1, endsAt, paused: false, remaining: null },
      stats: { ...s.stats, sessionCount: (s.stats.sessionCount || 0) + 1 },
    };
  });
  await chrome.alarms.clear(ALARM);
  if (state.pomoState.endsAt) {
    chrome.alarms.create(ALARM, { when: state.pomoState.endsAt });
  }
  await syncRules(state);
}

async function pausePomodoro(): Promise<void> {
  const state = await updateState((s) => {
    if (s.pomoState.phase === "idle" || s.pomoState.paused) return s;
    const remaining = s.pomoState.endsAt ? Math.max(0, s.pomoState.endsAt - Date.now()) : null;
    return {
      ...s,
      pomoState: { ...s.pomoState, paused: true, endsAt: null, remaining },
    };
  });
  await chrome.alarms.clear(ALARM);
  await syncRules(state);
}

async function resumePomodoro(): Promise<void> {
  const state = await updateState((s) => {
    if (!s.pomoState.paused) return s;
    const remaining = s.pomoState.remaining ?? phaseDurationMs(s, s.pomoState.phase);
    const endsAt = Date.now() + remaining;
    return {
      ...s,
      pomoState: { ...s.pomoState, paused: false, endsAt, remaining: null },
    };
  });
  if (state.pomoState.endsAt) {
    chrome.alarms.create(ALARM, { when: state.pomoState.endsAt });
  }
  await syncRules(state);
}

function nextPhase(current: Phase, round: number, totalRounds: number): { phase: Phase; round: number } {
  if (current === "focus") {
    if (round >= totalRounds) return { phase: "long", round };
    return { phase: "short", round };
  }
  if (current === "short") return { phase: "focus", round: round + 1 };
  if (current === "long") return { phase: "idle", round: 0 };
  return { phase: "idle", round: 0 };
}

async function advancePhase(): Promise<void> {
  const before = await getState();
  const { phase, round } = nextPhase(before.pomoState.phase, before.pomoState.round, before.pomo.rounds);
  const dur = phaseDurationMs(before, phase);
  const endsAt = phase === "idle" ? null : Date.now() + dur;

  const state = await updateState((s) => {
    const hoursAdded = before.pomoState.phase === "focus" ? before.pomo.focus / 60 : 0;
    return {
      ...s,
      active: phase !== "idle",
      pomoState: { phase, round, endsAt, paused: false, remaining: null },
      stats: {
        ...s.stats,
        hoursSavedWeek: Math.round((s.stats.hoursSavedWeek + hoursAdded) * 100) / 100,
      },
    };
  });

  await chrome.alarms.clear(ALARM);
  const willAutoStart = state.pomo.autoStart || phase === "focus";
  if (phase !== "idle" && endsAt && willAutoStart) {
    chrome.alarms.create(ALARM, { when: endsAt });
  }

  if (state.notifications) {
    const title =
      phase === "focus"
        ? "focus time"
        : phase === "short"
        ? "short break"
        : phase === "long"
        ? "long break"
        : "session done";
    const message =
      phase === "idle"
        ? "all rounds complete. nice."
        : `${Math.round(dur / 60_000)} minutes · stay on it.`;
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/128.png"),
      title: `just focus · ${title}`,
      message,
      priority: 2,
    });
  }

  if (before.pomoState.phase === "focus" && phase !== "focus") {
    chrome.tabs.create({ url: chrome.runtime.getURL("src/complete/index.html") });
  }

  await syncRules(state);
}

async function skipPhase(): Promise<void> {
  await advancePhase();
}

async function reconcileOnBoot(): Promise<void> {
  const state = await getState();
  if (state.pomoState.phase !== "idle" && state.pomoState.endsAt) {
    if (state.pomoState.endsAt <= Date.now()) {
      await advancePhase();
      return;
    }
    await chrome.alarms.clear(ALARM);
    chrome.alarms.create(ALARM, { when: state.pomoState.endsAt });
  }
  if (state.active) await syncRules(state);
  else await clearRules();
}

chrome.runtime.onInstalled.addListener(async () => {
  await clearRules();
  const state = await getState();
  await syncRules(state);
});

chrome.runtime.onStartup.addListener(reconcileOnBoot);

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM) return;
  await advancePhase();
});

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "local" || !changes["jf:state"]) return;
  const next = changes["jf:state"].newValue as State | undefined;
  const prev = changes["jf:state"].oldValue as State | undefined;
  if (!next) return;
  const sitesChanged = JSON.stringify(prev?.sites) !== JSON.stringify(next.sites);
  const activeChanged = prev?.active !== next.active;
  const phaseChanged = prev?.pomoState.phase !== next.pomoState.phase;
  const modeChanged = prev?.mode !== next.mode;
  if (sitesChanged || activeChanged || phaseChanged || modeChanged) {
    await syncRules(next);
  }
  if (!next.active && (await chrome.alarms.get(ALARM))) {
    await chrome.alarms.clear(ALARM);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab.url;
  if (!url || !/^https?:\/\//.test(url)) return;
  const state = await getState();
  const blockingActive =
    state.active && (state.mode === "block" || state.pomoState.phase === "focus");
  if (!blockingActive) return;
  const matched = blockedHostFor(url, state.sites);
  if (!matched) return;
  try {
    await chrome.tabs.update(tabId, { url: redirectTargetFor(matched) });
  } catch {
    /* tab may have closed */
  }
});

chrome.runtime.onMessage.addListener((msg: Msg, _sender, sendResponse) => {
  (async () => {
    if (msg.type === "ACTIVATE") await activate();
    else if (msg.type === "DEACTIVATE") await deactivate();
    else if (msg.type === "START_POMODORO") await startPomodoro();
    else if (msg.type === "PAUSE_POMODORO") await pausePomodoro();
    else if (msg.type === "RESUME_POMODORO") await resumePomodoro();
    else if (msg.type === "STOP_POMODORO") await deactivate();
    else if (msg.type === "SKIP_PHASE") await skipPhase();
    else if (msg.type === "SYNC_RULES") {
      const s = await getState();
      await syncRules(s);
    }
    sendResponse({ ok: true });
  })().catch(() => sendResponse({ ok: false }));
  return true;
});
