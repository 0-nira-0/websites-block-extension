import { useEffect, useState } from "react";
import Icon from "../popup/components/Icon";
import { defaultState, getState } from "../lib/storage";
import { send } from "../lib/messages";
import { applyTheme } from "../lib/time";
import type { State } from "../lib/types";

export default function Complete() {
  const [state, setStateLocal] = useState<State>(defaultState());
  const [now] = useState(new Date());

  useEffect(() => {
    getState().then((s) => {
      setStateLocal(s);
      applyTheme(s.theme);
    });
  }, []);

  const isLong = state.pomoState.phase === "long";
  const breakMin = isLong ? state.pomo.long : state.pomo.short;
  const focusMin = state.pomo.focus;
  const totalShipped = focusMin * Math.max(1, state.pomoState.round || 1);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  const onStartBreak = async () => {
    window.close();
  };

  const onSkip = async () => {
    await send({ type: "SKIP_PHASE" });
    window.close();
  };

  return (
    <div
      className="jf-root jf-grain"
      style={{
        minHeight: "100vh",
        background: "var(--jf-cream)",
        color: "var(--jf-bark)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--jf-forest)",
              display: "grid",
              placeItems: "center",
              color: "var(--jf-fern)",
            }}
          >
            <Icon name="leaf" size={16} />
          </div>
          <span
            style={{
              fontFamily: "var(--jf-font-display)",
              fontSize: 14,
              color: "var(--jf-forest)",
              letterSpacing: "-0.02em",
            }}
          >
            just focus.
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--jf-font-mono)",
            fontSize: 11,
            color: "var(--jf-leaf)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          session complete · {hh}:{mm}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
          position: "relative",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--jf-font-mono)",
            fontSize: 12,
            color: "var(--jf-moss)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          +{focusMin} minutes deep work
        </div>
        <div
          style={{
            fontFamily: "var(--jf-font-display)",
            fontSize: 140,
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
            color: "var(--jf-forest)",
          }}
        >
          NICE.
          <br />
          <span style={{ fontSize: 80, color: "var(--jf-moss)" }}>
            now <span style={{ color: "var(--jf-fire)" }}>{breakMin}</span> off.
          </span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontFamily: "var(--jf-font-mono)",
            fontSize: 14,
            color: "var(--jf-leaf)",
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          stand up. drink water. look out a window further than 6 feet.
          <br />
          we&apos;ll come for you in {breakMin}.
        </div>

        <div style={{ marginTop: 40, display: "flex", gap: 16 }}>
          <button onClick={onStartBreak} className="jf-btn jf-btn-primary" style={{ padding: "16px 26px", fontSize: 14 }}>
            <Icon name="play" size={14} /> start break ({breakMin}:00)
          </button>
          <button onClick={onSkip} className="jf-btn jf-btn-outline" style={{ padding: "16px 22px", fontSize: 13 }}>
            skip break · go again
          </button>
        </div>

        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 10 }}>
          {Array.from({ length: state.pomo.rounds }).map((_, i) => {
            const idx = i + 1;
            const done = idx < (state.pomoState.round || 1);
            const current = idx === (state.pomoState.round || 1);
            const bg = done ? "var(--jf-moss-deep)" : current ? "var(--jf-fern)" : "var(--jf-cream-3)";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: bg,
                    border: current ? "2px dashed var(--jf-moss)" : "none",
                  }}
                />
                {idx < state.pomo.rounds && <div style={{ width: 30, height: 1, background: "var(--jf-cream-3)" }} />}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            fontFamily: "var(--jf-font-mono)",
            color: "var(--jf-leaf)",
            letterSpacing: "0.1em",
          }}
        >
          round {state.pomoState.round || 1} of {state.pomo.rounds} done · {totalShipped} minutes shipped today
        </div>
      </div>
    </div>
  );
}
