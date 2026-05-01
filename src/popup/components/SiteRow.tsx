import SocialGlyph from "./SocialGlyph";
import Switch from "./Switch";
import Icon from "./Icon";
import type { Site } from "../../lib/types";

type Props = {
  site: Site;
  onToggle: () => void;
  onRemove?: () => void;
};

export default function SiteRow({ site, onToggle, onRemove }: Props) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 10,
        background: site.enabled ? "var(--jf-cream-2)" : "transparent",
        border: "1px solid",
        borderColor: site.enabled ? "var(--jf-cream-3)" : "transparent",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {site.preset ? (
        <SocialGlyph name={site.id} size={26} />
      ) : (
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: "var(--jf-cream-3)",
            display: "grid",
            placeItems: "center",
            color: "var(--jf-moss)",
          }}
        >
          <Icon name="globe" size={14} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--jf-bark)" }}>{site.name || site.url}</div>
        <div style={{ fontSize: 11, color: "var(--jf-leaf)", fontFamily: "var(--jf-font-mono)" }}>{site.url}</div>
      </div>
      <Switch on={site.enabled} onToggle={onToggle} ariaLabel={`toggle ${site.url}`} />
      {onRemove && (
        <button
          className="jf-btn jf-btn-ghost"
          style={{ padding: 4 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="remove"
        >
          <Icon name="trash" size={13} color="var(--jf-leaf)" />
        </button>
      )}
    </div>
  );
}
