import type { Site } from "./types";

export const SOCIAL_PRESETS: Array<{ id: string; name: string; url: string }> =
  [
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

export const TONE_COPY: Record<
  string,
  {
    eyebrow: string;
    line1: string;
    line2: string;
    line3: string;
    primary: string;
    subline: string;
  }
> = {
  goggins: {
    eyebrow: "⚠ access denied",
    line1: "",
    line2: "",
    line3: "",
    primary: "← get back to work",
    subline:
      "you opened a tab to scroll.\nyou don't need that dopamine hit.\nyou blocked this site for a reason.\nremember the reason.",
  },
  soft: {
    eyebrow: "this site is paused",
    line1: "breathe.",
    line2: "the work",
    line3: "is waiting.",
    primary: "← back to work",
    subline:
      "you set this boundary earlier. honor it. one breath in, one breath out, and back to the thing that matters.",
  },
};
