import { useMemo } from "react";
import Icon from "../components/Icon";
import ModeTabs from "../components/ModeTabs";
import SiteRow from "../components/SiteRow";
import { useStore } from "../hooks/useStore";
import { useActiveTab } from "../hooks/useActiveTab";
import { send } from "../../lib/messages";
import { formatMMSS } from "../../lib/time";
import type { Mode } from "../../lib/types";

type Props = { goto: (s: string) => void; tick: number };

export default function Home({ goto, tick }: Props) {
  const { state, set, update } = useStore();
  const activeTab = useActiveTab();
  const blockedCount = useMemo(() => state.sites.filter((s) => s.enabled).length, [state.sites]);
  const visible = state.sites.slice(0, 6);
  const alreadyBlocked = useMemo(() => {
    if (!activeTab) return false;
    return state.sites.some((s) => s.url === activeTab.host && s.enabled);
  }, [activeTab, state.sites]);

  const blockCurrent = () => {
    if (!activeTab) return;
    update((s) => {
      const existing = s.sites.find((x) => x.url === activeTab.host);
      if (existing) {
        return { ...s, sites: s.sites.map((x) => (x.id === existing.id ? { ...x, enabled: true } : x)) };
      }
      const id = `c-${Date.now()}`;
      return {
        ...s,
        sites: [...s.sites, { id, url: activeTab.host, name: activeTab.host, enabled: true, preset: false }],
      };
    });
  };

  const remaining = state.pomoState.endsAt
    ? Math.max(0, state.pomoState.endsAt - Date.now())
    : state.pomoState.remaining ?? state.pomo.focus * 60_000;
  const totalForPhase =
    (state.pomoState.phase === "focus"
      ? state.pomo.focus
      : state.pomoState.phase === "short"
      ? state.pomo.short
      : state.pomoState.phase === "long"
      ? state.pomo.long
      : state.pomo.focus) * 60_000;
  const progress = totalForPhase > 0 ? 1 - remaining / totalForPhase : 0;

  void tick;

  const onModeChange = (m: Mode) => set({ mode: m });

  const onPrimary = async () => {
    if (state.mode === "pomodoro") {
      if (!state.active) {
        await send({ type: "START_POMODORO" });
      } else if (state.pomo.strict && state.pomoState.phase === "focus") {
        return;
      } else {
        await send({ type: "STOP_POMODORO" });
      }
    } else {
      if (!state.active) {
        await send({ type: "ACTIVATE" });
      } else {
        await send({ type: "DEACTIVATE" });
      }
    }
  };

  const toggleSite = (id: string) => {
    update((s) => ({ ...s, sites: s.sites.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)) }));
  };

  return (
    <>
      <div
        style={{
          padding: "16px 18px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--jf-cream-2)",
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
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span
              style={{
                fontFamily: "var(--jf-font-display)",
                fontSize: 15,
                color: "var(--jf-forest)",
                letterSpacing: "-0.02em",
              }}
            >
              just focus.
            </span>
            <span
              style={{
                fontSize: 10,
                color: "var(--jf-leaf)",
                fontFamily: "var(--jf-font-mono)",
                letterSpacing: "0.05em",
              }}
            >
              v 0.1.0
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            className="jf-btn jf-btn-ghost"
            style={{ padding: 8 }}
            aria-label="blocklist"
            onClick={() => goto("blocklist")}
          >
            <Icon name="list" size={16} />
          </button>
          <button
            className="jf-btn jf-btn-ghost"
            style={{ padding: 8 }}
            aria-label="settings"
            onClick={() => goto("settings")}
          >
            <Icon name="settings" size={16} />
          </button>
        </div>
      </div>

      <div style={{ padding: "14px 18px 10px" }}>
        <ModeTabs
          mode={state.mode}
          onChange={(m) => {
            onModeChange(m);
            if (m === "pomodoro") goto("home");
          }}
        />
      </div>

      <div
        style={{
          margin: "6px 18px 12px",
          padding: "20px 20px 18px",
          borderRadius: 14,
          background: state.active ? "var(--jf-forest)" : "var(--jf-cream-2)",
          color: state.active ? "var(--jf-cream)" : "var(--jf-bark)",
          position: "relative",
          overflow: "hidden",
        }}
        className="jf-grain"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--jf-font-mono)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.7,
                marginBottom: 6,
              }}
            >
              {state.active ? "session active" : "ready when you are"}
            </div>
            <div
              style={{
                fontFamily: "var(--jf-font-display)",
                fontSize: state.mode === "pomodoro" ? 36 : 22,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {state.mode === "pomodoro"
                ? formatMMSS(remaining)
                : state.active
                ? `${blockedCount} sites blocked`
                : "stay sharp"}
            </div>
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: state.active ? "#a8e063" : "var(--jf-leaf)",
              boxShadow: state.active ? "0 0 0 4px rgba(168,224,99,0.2)" : "none",
              marginTop: 6,
            }}
          />
        </div>
        {state.mode === "pomodoro" && (
          <div
            style={{
              marginTop: 14,
              height: 4,
              borderRadius: 999,
              background: state.active ? "rgba(255,255,255,0.15)" : "var(--jf-cream-3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                background: state.active ? "var(--jf-fern)" : "var(--jf-leaf)",
                borderRadius: 999,
                transition: "width 0.4s",
              }}
            />
          </div>
        )}
        {state.active && state.mode === "pomodoro" && (
          <div
            style={{
              marginTop: 12,
              fontSize: 11,
              fontFamily: "var(--jf-font-mono)",
              opacity: 0.7,
              letterSpacing: "0.05em",
            }}
          >
            round {state.pomoState.round || 1} of {state.pomo.rounds} · {state.pomoState.phase}
          </div>
        )}
      </div>

      {state.mode === "pomodoro" && (
        <div style={{ padding: "0 18px 8px" }}>
          <button
            className="jf-btn jf-btn-ghost"
            style={{ width: "100%", padding: "10px 12px", fontSize: 12, justifyContent: "space-between", background: "var(--jf-cream-2)" }}
            onClick={() => goto("pomo")}
          >
            <span>
              {state.pomo.focus} / {state.pomo.short} / {state.pomo.long} · {state.pomo.rounds} rounds
            </span>
            <span style={{ color: "var(--jf-leaf)" }}>tune →</span>
          </button>
        </div>
      )}

      {activeTab && (
        <div
          style={{
            margin: "0 18px 10px",
            padding: "10px 12px",
            borderRadius: 10,
            background: "var(--jf-cream-2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Icon name="globe" size={16} color="var(--jf-leaf)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--jf-font-mono)",
                color: "var(--jf-leaf)",
                letterSpacing: "0.05em",
              }}
            >
              currently on
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--jf-bark)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {activeTab.host}
            </div>
          </div>
          <button
            className="jf-btn jf-btn-outline"
            style={{ padding: "6px 10px", fontSize: 11 }}
            disabled={alreadyBlocked}
            onClick={blockCurrent}
          >
            <Icon name="plus" size={11} /> {alreadyBlocked ? "blocked" : "block"}
          </button>
        </div>
      )}

      <div style={{ padding: "0 18px", flex: 1, overflowY: "auto" }} className="jf-scroll">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--jf-font-mono)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--jf-leaf)",
            }}
          >
            blocklist · {blockedCount}
          </span>
          <button
            className="jf-btn jf-btn-ghost"
            style={{ padding: "4px 8px", fontSize: 12 }}
            onClick={() => goto("blocklist")}
          >
            manage →
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {visible.map((s) => (
            <SiteRow key={s.id} site={s} onToggle={() => toggleSite(s.id)} />
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 18px 18px", borderTop: "1px solid var(--jf-cream-2)" }}>
        {(() => {
          const strictLock =
            state.mode === "pomodoro" && state.active && state.pomo.strict && state.pomoState.phase === "focus";
          return (
            <button
              onClick={onPrimary}
              disabled={strictLock}
              className="jf-btn jf-btn-primary"
              style={{
                width: "100%",
                padding: "14px 18px",
                fontSize: 14,
                background: strictLock
                  ? "var(--jf-cream-3)"
                  : state.active
                  ? "var(--jf-fire)"
                  : "var(--jf-forest)",
                color: strictLock ? "var(--jf-bark-2)" : "var(--jf-cream)",
                cursor: strictLock ? "not-allowed" : "pointer",
              }}
            >
              <Icon name={state.active ? "stop" : "play"} size={14} />
              {strictLock
                ? "strict · ride it out"
                : state.active
                ? "End session"
                : state.mode === "pomodoro"
                ? `Start ${state.pomo.focus} min focus`
                : "Start blocking"}
            </button>
          );
        })()}
      </div>
    </>
  );
}
