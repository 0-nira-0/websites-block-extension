import { useEffect, useState } from "react";
import Home from "./screens/Home";
import { useStore } from "./hooks/useStore";
import { applyTheme } from "../lib/time";

type Screen = "home" | "blocklist" | "pomo" | "settings" | "onboarding";

export default function App() {
  const { state, ready } = useStore();
  const [screen, setScreen] = useState<Screen>("home");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (ready) applyTheme(state.theme);
  }, [state.theme, ready]);

  useEffect(() => {
    if (ready && !state.seenOnboarding) setScreen("onboarding");
  }, [ready, state.seenOnboarding]);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const goto = (s: string) => setScreen(s as Screen);

  return (
    <div
      className="jf-root"
      style={{
        width: 400,
        height: 600,
        background: "var(--jf-cream)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {screen === "home" && <Home goto={goto} tick={tick} />}
    </div>
  );
}
