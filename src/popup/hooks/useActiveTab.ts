import { useEffect, useState } from "react";

export type ActiveTab = { url: string; host: string } | null;

const SKIP_HOSTS = new Set(["", "newtab", "extensions"]);

function parseHost(rawUrl: string | undefined): ActiveTab {
  if (!rawUrl) return null;
  try {
    const u = new URL(rawUrl);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    let host = u.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
    if (SKIP_HOSTS.has(host)) return null;
    return { url: rawUrl, host };
  } catch {
    return null;
  }
}

export function useActiveTab(): ActiveTab {
  const [tab, setTab] = useState<ActiveTab>(null);
  useEffect(() => {
    let mounted = true;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!mounted) return;
      const url = tabs[0]?.url;
      setTab(parseHost(url));
    });
    return () => {
      mounted = false;
    };
  }, []);
  return tab;
}
