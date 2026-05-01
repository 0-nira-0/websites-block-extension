import Icon from "../components/Icon";
import Stepper from "../components/Stepper";
import Switch from "../components/Switch";
import { useStore } from "../hooks/useStore";
import type { PomoConfig } from "../../lib/types";

type Props = { goto: (s: string) => void };

export default function PomodoroSettings({ goto }: Props) {
  const { state, update } = useStore();
  const p = state.pomo;

  const setP = (patch: Partial<PomoConfig>) => {
    update((s) => ({ ...s, pomo: { ...s.pomo, ...patch } }));
  };

  const totalMin = p.focus * p.rounds + p.short * (p.rounds - 1);

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
          <div style={{ fontFamily: "var(--jf-font-display)", fontSize: 14, color: "var(--jf-forest)" }}>Pomodoro</div>
          <div
            style={{
              fontSize: 10,
              fontFamily: "var(--jf-font-mono)",
              color: "var(--jf-leaf)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            focus · break · repeat
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }} className="jf-scroll">
        <div
          className="jf-grain"
          style={{
            padding: 18,
            borderRadius: 14,
            background: "var(--jf-forest)",
            color: "var(--jf-cream)",
            textAlign: "center",
            marginBottom: 18,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: "var(--jf-font-mono)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--jf-fern)",
              marginBottom: 6,
              position: "relative",
            }}
          >
            session preview
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 4,
              fontFamily: "var(--jf-font-display)",
              letterSpacing: "-0.03em",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 32 }}>{p.focus}</span>
            <span style={{ fontSize: 14, color: "var(--jf-fern)" }}>/</span>
            <span style={{ fontSize: 18 }}>{p.short}</span>
            <span style={{ fontSize: 14, color: "var(--jf-fern)" }}>/</span>
            <span style={{ fontSize: 18 }}>{p.long}</span>
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "var(--jf-font-mono)",
              color: "var(--jf-fern)",
              marginTop: 6,
              letterSpacing: "0.08em",
              position: "relative",
            }}
          >
            {p.rounds} rounds · {totalMin} min total
          </div>
        </div>

        {[
          { label: "Focus duration", v: p.focus, k: "focus" as const, min: 5, max: 90, step: 5, suf: "min" },
          { label: "Short break", v: p.short, k: "short" as const, min: 1, max: 30, step: 1, suf: "min" },
          { label: "Long break", v: p.long, k: "long" as const, min: 5, max: 60, step: 5, suf: "min" },
          { label: "Rounds", v: p.rounds, k: "rounds" as const, min: 1, max: 12, step: 1, suf: "x" },
        ].map((row) => (
          <div
            key={row.k}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 4px",
              borderBottom: "1px solid var(--jf-cream-2)",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--jf-bark)", fontWeight: 500 }}>{row.label}</span>
            <Stepper
              value={row.v}
              onChange={(v) => setP({ [row.k]: v } as Partial<PomoConfig>)}
              min={row.min}
              max={row.max}
              step={row.step}
              suffix={row.suf}
            />
          </div>
        ))}

        <div style={{ marginTop: 14 }}>
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
            behavior
          </div>
          {[
            {
              label: "Auto-start breaks",
              desc: "next round begins on its own",
              v: p.autoStart,
              k: "autoStart" as const,
            },
            { label: "Strict mode", desc: "no early stop. no excuses.", v: p.strict, k: "strict" as const },
          ].map((row) => (
            <div
              key={row.k}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 4px",
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: "var(--jf-bark)", fontWeight: 500 }}>{row.label}</div>
                <div style={{ fontSize: 11, color: "var(--jf-leaf)" }}>{row.desc}</div>
              </div>
              <Switch on={row.v} onToggle={() => setP({ [row.k]: !row.v } as Partial<PomoConfig>)} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 18px 16px", borderTop: "1px solid var(--jf-cream-2)" }}>
        <button className="jf-btn jf-btn-primary" style={{ width: "100%", padding: "13px 18px" }} onClick={() => goto("home")}>
          done
        </button>
      </div>
    </>
  );
}
