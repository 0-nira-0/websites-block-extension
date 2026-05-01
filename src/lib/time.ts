export function formatMMSS(ms: number): string {
  if (ms <= 0) return "00:00";
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function nowMs(): number {
  return Date.now();
}

export function applyTheme(theme: "light" | "dark" | "system") {
  const root = document.documentElement;
  let resolved: "light" | "dark" = "light";
  if (theme === "system") {
    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } else {
    resolved = theme;
  }
  root.setAttribute("data-theme", resolved);
}
