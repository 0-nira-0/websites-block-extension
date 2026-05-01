type Props = { name: string; size?: number; stroke?: number; color?: string };

export default function Icon({ name, size = 16, stroke = 1.6, color = "currentColor" }: Props) {
  const c = color;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: c,
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "play":
      return <svg {...common}><path d="M7 5l12 7-12 7V5z" fill={c} /></svg>;
    case "pause":
      return <svg {...common}><rect x="6" y="5" width="4" height="14" fill={c} /><rect x="14" y="5" width="4" height="14" fill={c} /></svg>;
    case "stop":
      return <svg {...common}><rect x="6" y="6" width="12" height="12" fill={c} /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z" /></svg>;
    case "tomato":
      return <svg {...common}><path d="M5 7h14" /><path d="M12 7c0-2 1-3 3-3" /><path d="M6 7c0 8 3 13 6 13s6-5 6-13" /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "x":
      return <svg {...common}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case "back":
      return <svg {...common}><path d="M15 18l-6-6 6-6" /></svg>;
    case "settings":
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /></svg>;
    case "list":
      return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
    case "trash":
      return <svg {...common}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>;
    case "globe":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>;
    case "leaf":
      return <svg {...common}><path d="M5 19c0-9 6-15 15-15-1 9-6 15-15 15z" /><path d="M5 19l8-8" /></svg>;
    case "check":
      return <svg {...common}><path d="M5 12l5 5 9-11" /></svg>;
    case "lock":
      return <svg {...common}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>;
    case "fire":
      return <svg {...common}><path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4-1 0 2-3 3-6z" /></svg>;
    default:
      return null;
  }
}
