import type { Site } from "./types";

const RULE_ID_OFFSET = 1000;

function normalizeUrl(raw: string): string {
  let v = raw.trim().toLowerCase();
  v = v.replace(/^https?:\/\//, "");
  v = v.replace(/^www\./, "");
  v = v.replace(/[\/?#].*$/, "");
  return v;
}

function ruleIdFor(index: number): number {
  return RULE_ID_OFFSET + index;
}

function redirectUrl(host: string): string {
  const base = chrome.runtime.getURL("src/redirect/index.html");
  return `${base}?host=${encodeURIComponent(host)}`;
}

export async function clearRules(): Promise<void> {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  if (existing.length === 0) return;
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((r) => r.id),
    addRules: [],
  });
}

export async function applyRules(sites: Site[]): Promise<void> {
  const enabled = sites.filter((s) => s.enabled && s.url);
  const seen = new Set<string>();
  const newRules: chrome.declarativeNetRequest.Rule[] = [];
  enabled.forEach((site) => {
    const host = normalizeUrl(site.url);
    if (!host || seen.has(host)) return;
    seen.add(host);
    newRules.push({
      id: ruleIdFor(newRules.length),
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: { url: redirectUrl(host) },
      },
      condition: {
        urlFilter: `||${host}^`,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    });
  });
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((r) => r.id),
    addRules: newRules,
  });
}
