type Props = { on: boolean; onToggle: () => void; ariaLabel?: string };

export default function Switch({ on, onToggle, ariaLabel }: Props) {
  return (
    <button
      type="button"
      className="jf-switch"
      data-on={on ? "true" : "false"}
      aria-label={ariaLabel}
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    />
  );
}
