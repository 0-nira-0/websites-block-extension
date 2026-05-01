export type Site = {
  id: string;
  url: string;
  enabled: boolean;
  preset?: boolean;
  name?: string;
};

export type Mode = "block" | "pomodoro";

export type Phase = "idle" | "focus" | "short" | "long";

export type PomoState = {
  phase: Phase;
  round: number;
  endsAt: number | null;
  paused: boolean;
  remaining: number | null;
};

export type PomoConfig = {
  focus: number;
  short: number;
  long: number;
  rounds: number;
  autoStart: boolean;
  strict: boolean;
};

export type RedirectTone = "soft" | "goggins" | "humor";
export type Theme = "light" | "dark" | "system";

export type Stats = {
  blocksToday: number;
  blocksDate: string;
  longestStreakDays: number;
  hoursSavedWeek: number;
  sessionCount: number;
};

export type State = {
  mode: Mode;
  active: boolean;
  sites: Site[];
  pomo: PomoConfig;
  pomoState: PomoState;
  theme: Theme;
  redirectTone: RedirectTone;
  notifications: boolean;
  sound: boolean;
  seenOnboarding: boolean;
  stats: Stats;
};

export const DEFAULT_POMO: PomoConfig = {
  focus: 25,
  short: 5,
  long: 15,
  rounds: 4,
  autoStart: true,
  strict: false,
};

export const DEFAULT_POMO_STATE: PomoState = {
  phase: "idle",
  round: 0,
  endsAt: null,
  paused: false,
  remaining: null,
};

export const DEFAULT_STATS: Stats = {
  blocksToday: 0,
  blocksDate: "",
  longestStreakDays: 0,
  hoursSavedWeek: 0,
  sessionCount: 0,
};
