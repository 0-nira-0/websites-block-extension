import type { Site } from "./types";

export const SOCIAL_PRESETS: Array<{ id: string; name: string; url: string }> = [
  { id: "youtube", name: "YouTube", url: "youtube.com" },
  { id: "instagram", name: "Instagram", url: "instagram.com" },
  { id: "tiktok", name: "TikTok", url: "tiktok.com" },
  { id: "twitter", name: "Twitter / X", url: "x.com" },
  { id: "facebook", name: "Facebook", url: "facebook.com" },
  { id: "reddit", name: "Reddit", url: "reddit.com" },
  { id: "linkedin", name: "LinkedIn", url: "linkedin.com" },
  { id: "telegram", name: "Telegram", url: "web.telegram.org" },
  { id: "twitch", name: "Twitch", url: "twitch.tv" },
  { id: "pinterest", name: "Pinterest", url: "pinterest.com" },
  { id: "snapchat", name: "Snapchat", url: "snapchat.com" },
  { id: "threads", name: "Threads", url: "threads.net" },
];

export const DEFAULT_ENABLED_PRESETS = new Set([
  "youtube",
  "instagram",
  "tiktok",
  "twitter",
  "reddit",
]);

export const defaultSites = (): Site[] =>
  SOCIAL_PRESETS.map((p) => ({
    id: p.id,
    url: p.url,
    name: p.name,
    enabled: DEFAULT_ENABLED_PRESETS.has(p.id),
    preset: true,
  }));

export const MOTIVATION_VIDEOS: Record<string, string> = {
  goggins: "E9MOhxS46d8",
  soft: "E9MOhxS46d8",
  humor: "E9MOhxS46d8",
};

export const TONE_COPY: Record<string, { eyebrow: string; line1: string; line2: string; line3: string; primary: string; secondary: string; subline: string }> = {
  goggins: {
    eyebrow: "⚠ access denied",
    line1: "Who's gonna",
    line2: "carry",
    line3: "the boats?",
    primary: "← get back to work",
    secondary: "i really need this · 60s",
    subline: "you opened a tab to scroll. you don't need that dopamine hit. you blocked this site for a reason. remember the reason.",
  },
  soft: {
    eyebrow: "this site is paused",
    line1: "breathe.",
    line2: "the work",
    line3: "is waiting.",
    primary: "← back to work",
    secondary: "open anyway · 60s",
    subline: "you set this boundary earlier. honor it. one breath in, one breath out, and back to the thing that matters.",
  },
  humor: {
    eyebrow: "lol no",
    line1: "absolutely",
    line2: "not",
    line3: "today.",
    primary: "← fine, i'll work",
    secondary: "i'm weak · 60s",
    subline: "you blocked this for a reason and that reason was you, drinking iced coffee at 9am with main-character energy. let's not.",
  },
};
