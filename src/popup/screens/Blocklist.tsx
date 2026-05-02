import { useMemo, useState } from "react";
import Icon from "../components/Icon";
import SocialGlyph from "../components/SocialGlyph";
import Switch from "../components/Switch";
import { SOCIAL_PRESETS } from "../../lib/presets";
import { useStore } from "../hooks/useStore";

type Props = { goto: (s: string) => void };

function normalize(input: string): string {
  let v = input.trim().toLowerCase();
  v = v.replace(/^https?:\/\//, "");
  v = v.replace(/^www\./, "");
  v = v.replace(/[\/?#].*$/, "");
  return v;
}

export default function Blocklist({ goto }: Props) {
  const { state, update } = useStore();
  const [input, setInput] = useState("");

  const presetIds = useMemo(() => new Set(SOCIAL_PRESETS.map((p) => p.id)), []);
  const presets = state.sites.filter((s) => s.preset);
  const customs = state.sites.filter((s) => !s.preset);

  const togglePreset = (id: string) => {
    update((s) => ({
      ...s,
      sites: s.sites.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)),
    }));
  };

  const toggleCustom = (id: string) => togglePreset(id);

  const removeCustom = (id: string) => {
    update((s) => ({ ...s, sites: s.sites.filter((x) => x.id !== id) }));
  };

  const add = () => {
    const url = normalize(input);
    if (!url) return;
    update((s) => {
      if (s.sites.some((x) => x.url === url)) return s;
      const id = `c-${Date.now()}`;
      return {
        ...s,
        sites: [...s.sites, { id, url, name: url, enabled: true, preset: false }],
      };
    });
    setInput("");
  };

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
          <div style={{ fontFamily: "var(--jf-font-display)", fontSize: 14, color: "var(--jf-forest)" }}>Blocklist</div>
          <div
            style={{
              fontSize: 10,
              fontFamily: "var(--jf-font-mono)",
              color: "var(--jf-leaf)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            what gets the door
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 18px 8px" }}>
        <div style={{ display: "flex", gap: 6, padding: 4, borderRadius: 12, background: "var(--jf-cream-2)" }}>
          <div style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
            <Icon name="globe" size={14} color="var(--jf-leaf)" />
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
            }}
            placeholder="paste url or domain"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: "10px 4px",
              fontSize: 13,
              color: "var(--jf-bark)",
              fontFamily: "var(--jf-font-ui)",
              minWidth: 0,
            }}
          />
          <button
            className="jf-btn jf-btn-primary"
            style={{ padding: "8px 12px", fontSize: 12, borderRadius: 8 }}
            onClick={add}
          >
            <Icon name="plus" size={12} /> add
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--jf-leaf)", fontFamily: "var(--jf-font-mono)" }}>
          tip: use the <span style={{ color: "var(--jf-bark)" }}>+ block this site</span> button on home
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 18px 12px" }} className="jf-scroll">
        <div
          style={{
            fontSize: 11,
            fontFamily: "var(--jf-font-mono)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--jf-leaf)",
            margin: "12px 0 8px",
          }}
        >
          social presets
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {presets.map((p) => (
            <div
              key={p.id}
              onClick={() => togglePreset(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid",
                borderColor: p.enabled ? "var(--jf-moss-deep)" : "var(--jf-cream-2)",
                background: p.enabled ? "var(--jf-cream-2)" : "transparent",
                cursor: "pointer",
              }}
            >
              {presetIds.has(p.id) ? (
                <SocialGlyph name={p.id} size={20} />
              ) : (
                <Icon name="globe" size={16} color="var(--jf-moss)" />
              )}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: p.enabled ? "var(--jf-bark)" : "var(--jf-leaf)",
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.name || p.url}
              </span>
              <div className="jf-check" data-on={p.enabled ? "true" : "false"} />
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 11,
            fontFamily: "var(--jf-font-mono)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--jf-leaf)",
            margin: "20px 0 8px",
          }}
        >
          custom · {customs.length}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {customs.length === 0 && (
            <div
              style={{
                padding: "14px 12px",
                borderRadius: 10,
                background: "var(--jf-cream-2)",
                fontSize: 12,
                color: "var(--jf-leaf)",
                fontFamily: "var(--jf-font-mono)",
                textAlign: "center",
              }}
            >
              no custom sites yet
            </div>
          )}
          {customs.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: "var(--jf-cream-2)",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: "var(--jf-cream-3)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--jf-moss)",
                }}
              >
                <Icon name="globe" size={12} />
              </div>
              <span
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: "var(--jf-bark)",
                  fontFamily: "var(--jf-font-mono)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: 0,
                }}
              >
                {c.url}
              </span>
              <Switch on={c.enabled} onToggle={() => toggleCustom(c.id)} />
              <button
                className="jf-btn jf-btn-ghost"
                style={{ padding: 4 }}
                onClick={() => removeCustom(c.id)}
                aria-label={`remove ${c.url}`}
              >
                <Icon name="trash" size={13} color="var(--jf-leaf)" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
