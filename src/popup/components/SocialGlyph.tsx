type Props = { name: string; size?: number };

const PALETTE: Record<string, string> = {
  youtube: "#cc2a2a",
  instagram: "#c44569",
  tiktok: "#1a1a1a",
  twitter: "#1a1a1a",
  facebook: "#3b5998",
  reddit: "#d2691e",
  linkedin: "#1f5285",
  telegram: "#3a8bbb",
  twitch: "#6441a5",
  pinterest: "#bd081c",
  snapchat: "#d4b942",
  threads: "#1a1a1a",
};

const LETTERS: Record<string, string> = {
  youtube: "Y",
  instagram: "I",
  tiktok: "T",
  twitter: "X",
  facebook: "f",
  reddit: "r",
  linkedin: "in",
  telegram: "t",
  twitch: "tw",
  pinterest: "P",
  snapchat: "S",
  threads: "@",
};

export default function SocialGlyph({ name, size = 22 }: Props) {
  const bg = PALETTE[name] || "#999";
  const letter = LETTERS[name] || "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: size * 0.5,
        fontFamily: "var(--jf-font-display)",
        color: "#fff",
        letterSpacing: "-0.04em",
        background: bg,
      }}
    >
      <span>{letter}</span>
    </div>
  );
}
