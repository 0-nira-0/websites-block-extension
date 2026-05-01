import { useEffect, useState } from "react";
import { defaultState, getState } from "../lib/storage";
import { applyTheme } from "../lib/time";
import type { State } from "../lib/types";

function readParams() {
  const sp = new URLSearchParams(window.location.search);
  const from = sp.get("from") || "";
  const host = sp.get("host") || "";
  let displayHost = host;
  if (!displayHost && from) {
    try {
      displayHost = new URL(from).hostname;
    } catch {
      displayHost = from;
    }
  }
  return { from, host: displayHost };
}

export default function Redirect() {
  const [state, setState] = useState<State>(defaultState());
  const [params] = useState(readParams);

  useEffect(() => {
    getState().then((s) => {
      setState(s);
      applyTheme(s.theme);
    });
  }, []);

  return (
    <div
      className="jf-root"
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--jf-font-ui)",
      }}
    >
      <div style={{ padding: 40 }}>
        <div
          style={{
            fontFamily: "var(--jf-font-mono)",
            fontSize: 11,
            color: "#ff3d00",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          ⚠ blocked
        </div>
        <div
          style={{
            fontFamily: "var(--jf-font-display)",
            fontSize: 64,
            lineHeight: 1,
          }}
        >
          {params.host || "this site is blocked"}
        </div>
        <div style={{ marginTop: 18, color: "#666", fontSize: 13 }}>
          you set this boundary. tone: {state.redirectTone}.
        </div>
        <div style={{ marginTop: 28 }}>
          <button
            className="jf-btn"
            style={{
              background: "#ff3d00",
              color: "#0a0a0a",
              padding: "14px 22px",
              fontFamily: "var(--jf-font-display)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
            onClick={() => history.back()}
          >
            ← get back to work
          </button>
        </div>
      </div>
    </div>
  );
}
