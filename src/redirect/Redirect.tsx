import { useEffect, useMemo, useState } from "react";
import { defaultState, getState, updateState } from "../lib/storage";
import { applyTheme } from "../lib/time";
import { MOTIVATION_VIDEOS, TONE_COPY } from "../lib/presets";
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

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Redirect() {
  const [state, setStateLocal] = useState<State>(defaultState());
  const [params] = useState(readParams);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    getState().then((s) => {
      setStateLocal(s);
      applyTheme(s.theme);
    });
    updateState((s) => {
      const today = todayKey();
      const sameDay = s.stats.blocksDate === today;
      return {
        ...s,
        stats: {
          ...s.stats,
          blocksDate: today,
          blocksToday: sameDay ? s.stats.blocksToday + 1 : 1,
        },
      };
    }).then((next) => setStateLocal(next));
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const tone = state.redirectTone;
  const copy = TONE_COPY[tone] || TONE_COPY.goggins;
  const showVideo = tone === "goggins";
  const gogginsVideos = MOTIVATION_VIDEOS.goggins;
  const videoId = showVideo
    ? gogginsVideos[(state.stats.blocksToday || 0) % gogginsVideos.length]
    : "";
  const accent = tone === "soft" ? "#6b8e5a" : tone === "humor" ? "#d4922f" : "#ff3d00";

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const stripeColor = useMemo(() => accent, [accent]);

  const onBack = () => {
    if (history.length > 1) history.back();
    else window.close();
  };

  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`
    : "";

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
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 14,
          background: `repeating-linear-gradient(45deg, ${stripeColor} 0 14px, #0a0a0a 14px 28px)`,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          borderBottom: "1px solid #222",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: accent,
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth={2}>
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--jf-font-display)", fontSize: 13, letterSpacing: "0.02em" }}>
            just focus.
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--jf-font-mono)",
            fontSize: 11,
            color: "#666",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          blocked at {hh}:{mm}:{ss} · session {String(state.stats.sessionCount || 1).padStart(2, "0")}
        </div>
        <span
          style={{
            color: accent,
            fontSize: 11,
            fontFamily: "var(--jf-font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          locked
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: showVideo ? "1fr 1fr" : "1fr",
          gap: 48,
          padding: "40px 60px",
          alignItems: "center",
          justifyItems: showVideo ? "stretch" : "center",
          textAlign: showVideo ? "left" : "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--jf-font-mono)",
              fontSize: 11,
              color: accent,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            {copy.eyebrow}
          </div>
          <div
            style={{
              fontFamily: "var(--jf-font-display)",
              fontSize: 96,
              lineHeight: 0.92,
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
            }}
          >
            {copy.line1}
            <br />
            <span style={{ color: accent }}>{copy.line2}</span>
            <br />
            {copy.line3}
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: "var(--jf-font-mono)",
              fontSize: 13,
              color: "#999",
              maxWidth: 460,
              lineHeight: 1.6,
            }}
          >
            {copy.subline}
            {params.host && (
              <>
                <br />
                <span style={{ color: accent }}>{params.host}</span> is on your blocklist.
              </>
            )}
          </div>

          <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: showVideo ? "flex-start" : "center" }}>
            <button
              onClick={onBack}
              className="jf-btn"
              style={{
                background: accent,
                color: "#0a0a0a",
                padding: "14px 22px",
                fontFamily: "var(--jf-font-display)",
                fontSize: 14,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {copy.primary}
            </button>
          </div>
        </div>

        {showVideo && (
        <div style={{ position: "relative", width: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: -10,
              left: -10,
              fontFamily: "var(--jf-font-mono)",
              fontSize: 10,
              color: accent,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              zIndex: 2,
              background: "#0a0a0a",
              padding: "4px 8px",
            }}
          >
            ▶ daily reminder
          </div>
          <div
            style={{
              aspectRatio: "16/9",
              border: `2px solid ${accent}`,
              background: "#000",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <iframe
              title="motivation"
              src={embedSrc}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: "var(--jf-font-mono)",
              fontSize: 11,
              color: "#666",
              letterSpacing: "0.05em",
            }}
          >
            video plays automatically · muted by default · click to unmute
          </div>
        </div>
        )}
      </div>

      <div
        style={{
          padding: "16px 32px",
          borderTop: "1px solid #222",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--jf-font-mono)",
          fontSize: 11,
          color: "#666",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>blocked today: {state.stats.blocksToday} attempts</span>
        <span>longest streak: {state.stats.longestStreakDays} days</span>
        <span>hours saved this week: {state.stats.hoursSavedWeek.toFixed(1)}</span>
        <span style={{ color: accent }}>stay. on. mission.</span>
      </div>
    </div>
  );
}
