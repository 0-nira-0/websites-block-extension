type Props = {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
};

export default function Stepper({ value, onChange, min, max, step = 1, suffix }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        className="jf-btn jf-btn-ghost"
        style={{ padding: 4, width: 26, height: 26, background: "var(--jf-cream-2)" }}
        onClick={() => onChange(Math.max(min, value - step))}
        aria-label="decrement"
      >
        −
      </button>
      <div
        style={{
          minWidth: 56,
          textAlign: "center",
          fontFamily: "var(--jf-font-display)",
          fontSize: 18,
          color: "var(--jf-forest)",
        }}
      >
        {value}
        {suffix && (
          <span
            style={{
              fontSize: 10,
              color: "var(--jf-leaf)",
              marginLeft: 3,
              fontFamily: "var(--jf-font-mono)",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <button
        className="jf-btn jf-btn-ghost"
        style={{ padding: 4, width: 26, height: 26, background: "var(--jf-cream-2)" }}
        onClick={() => onChange(Math.min(max, value + step))}
        aria-label="increment"
      >
        +
      </button>
    </div>
  );
}
