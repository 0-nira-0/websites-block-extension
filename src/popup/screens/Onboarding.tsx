import { useState } from "react";
import { useStore } from "../hooks/useStore";

type Props = { goto: (s: string) => void };

const STEPS = [
  { n: "01", t: "pick your blocklist", d: "sites you don't trust yourself with" },
  { n: "02", t: "choose your mode", d: "always-on or 25-min sprints" },
  { n: "03", t: "get reminded who you are", d: "we'll yell at you when needed" },
];

export default function Onboarding({ goto }: Props) {
  const { set } = useStore();
  const [step, setStep] = useState(0);
  const max = STEPS.length;

  const next = () => {
    if (step < max - 1) {
      setStep(step + 1);
      return;
    }
    set({ seenOnboarding: true });
    goto("home");
  };

  return (
    <div
      className="jf-grain"
      style={{
        flex: 1,
        background: "var(--jf-forest)",
        color: "var(--jf-cream)",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <span style={{ fontFamily: "var(--jf-font-display)", fontSize: 14 }}>just focus.</span>
        <span
          style={{
            fontFamily: "var(--jf-font-mono)",
            fontSize: 10,
            color: "var(--jf-fern)",
            letterSpacing: "0.15em",
          }}
        >
          {step + 1} / {max}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "var(--jf-font-mono)",
            fontSize: 11,
            color: "var(--jf-fern)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          welcome.
        </div>
        <div
          style={{
            fontFamily: "var(--jf-font-display)",
            fontSize: 42,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            marginBottom: 18,
          }}
        >
          stop scrolling.
          <br />
          <span style={{ color: "var(--jf-fern)" }}>start shipping.</span>
        </div>
        <div style={{ fontSize: 14, color: "var(--jf-lichen)", lineHeight: 1.6, maxWidth: 320 }}>
          pick the sites that steal your time. choose a mode. we handle the rest.
        </div>

        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
          {STEPS.map((s, i) => {
            const dim = i > step;
            return (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: dim ? 0.45 : 1 }}>
                <div
                  style={{
                    fontFamily: "var(--jf-font-mono)",
                    fontSize: 11,
                    color: "var(--jf-fern)",
                    marginTop: 2,
                    letterSpacing: "0.1em",
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--jf-font-display)",
                      fontSize: 14,
                      color: "var(--jf-cream)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.t}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--jf-fern)" }}>{s.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={next} className="jf-btn jf-btn-fire" style={{ width: "100%", padding: "14px 18px" }}>
        {step < max - 1 ? "next →" : "let's go →"}
      </button>
    </div>
  );
}
