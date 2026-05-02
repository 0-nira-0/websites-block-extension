import Icon from "../components/Icon";
import Switch from "../components/Switch";
import { useStore } from "../hooks/useStore";
import type { RedirectTone, Theme } from "../../lib/types";

type Props = { goto: (s: string) => void };

const TONES: Array<{ id: RedirectTone; t: string; d: string }> = [
  { id: "soft", t: "soft", d: "gentle nudges, breathing reminders" },
  { id: "goggins", t: "goggins", d: "yells. video. no mercy." },
];

const THEMES: Theme[] = ["light", "dark", "system"];

export default function Settings({ goto }: Props) {
  const { state, set } = useStore();

  return (
    <>
      <div
        style={{
          padding: "14px 18px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid var(--jf-cream-2)",
        }}
      >
        <button className="jf-btn jf-btn-ghost" style={{ padding: 6 }} onClick={() => goto("home")} aria-label="back">
          <Icon name="back" size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--jf-font-display)", fontSize: 14, color: "var(--jf-forest)" }}>Settings</div>
          <div
            style={{
              fontSize: 10,
              fontFamily: "var(--jf-font-mono)",
              color: "var(--jf-leaf)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            tune your discipline
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }} className="jf-scroll">
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 11,
              fontFamily: "var(--jf-font-mono)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--jf-leaf)",
              marginBottom: 8,
            }}
          >
            appearance
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {THEMES.map((t) => {
              const on = state.theme === t;
              return (
                <button
                  key={t}
                  onClick={() => set({ theme: t })}
                  className="jf-btn"
                  style={{
                    padding: "10px 8px",
                    fontSize: 12,
                    border: "1.5px solid",
                    borderColor: on ? "var(--jf-forest)" : "var(--jf-cream-3)",
                    background: on ? "var(--jf-cream-2)" : "transparent",
                    color: on ? "var(--jf-forest)" : "var(--jf-leaf)",
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 11,
              fontFamily: "var(--jf-font-mono)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--jf-leaf)",
              marginBottom: 8,
            }}
          >
            redirect attitude
          </div>
          {TONES.map((o) => {
            const on = state.redirectTone === o.id;
            return (
              <div
                key={o.id}
                onClick={() => set({ redirectTone: o.id })}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: on ? "var(--jf-cream-2)" : "transparent",
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor: on ? "var(--jf-forest)" : "var(--jf-cream-3)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {on && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--jf-forest)" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--jf-bark)" }}>{o.t}</div>
                  <div style={{ fontSize: 11, color: "var(--jf-leaf)" }}>{o.d}</div>
                </div>
              </div>
            );
          })}
        </div>

        {[
          { label: "Notifications", desc: "ping when sessions end", v: state.notifications, k: "notifications" as const },
          { label: "Sound effects", desc: "soft chimes on transitions", v: state.sound, k: "sound" as const },
        ].map((row) => (
          <div
            key={row.k}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 4px",
              borderTop: "1px solid var(--jf-cream-2)",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "var(--jf-bark)", fontWeight: 500 }}>{row.label}</div>
              <div style={{ fontSize: 11, color: "var(--jf-leaf)" }}>{row.desc}</div>
            </div>
            <Switch on={row.v} onToggle={() => set({ [row.k]: !row.v })} />
          </div>
        ))}

        <div style={{ marginTop: 24, padding: 14, background: "var(--jf-cream-2)", borderRadius: 10 }}>
          <div
            style={{
              fontSize: 11,
              fontFamily: "var(--jf-font-mono)",
              color: "var(--jf-leaf)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            data
          </div>
          <div style={{ fontSize: 12, color: "var(--jf-bark-2)", lineHeight: 1.5 }}>
            everything stays on your device. no accounts. no telemetry. no servers.
          </div>
        </div>
      </div>
    </>
  );
}
