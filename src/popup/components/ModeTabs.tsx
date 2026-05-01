import Icon from "./Icon";
import type { Mode } from "../../lib/types";

type Props = { mode: Mode; onChange: (m: Mode) => void };

export default function ModeTabs({ mode, onChange }: Props) {
  const tabs: Array<{ id: Mode; label: string; icon: string }> = [
    { id: "block", label: "Block", icon: "shield" },
    { id: "pomodoro", label: "Pomodoro", icon: "tomato" },
  ];
  return (
    <div
      style={{
        background: "var(--jf-cream-2)",
        borderRadius: 10,
        padding: 4,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 4,
      }}
    >
      {tabs.map((t) => {
        const on = mode === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="jf-btn"
            style={{
              padding: "8px 10px",
              fontSize: 13,
              fontWeight: 600,
              background: on ? "var(--jf-cream)" : "transparent",
              color: on ? "var(--jf-forest)" : "var(--jf-bark-2)",
              boxShadow: on ? "var(--jf-shadow-sm)" : "none",
              borderRadius: 8,
            }}
          >
            <Icon name={t.icon} size={14} /> {t.label}
          </button>
        );
      })}
    </div>
  );
}
