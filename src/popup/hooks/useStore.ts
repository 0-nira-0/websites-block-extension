import { useEffect, useState, useCallback } from "react";
import { defaultState, getState, onStateChange, setState as writeState, updateState } from "../../lib/storage";
import type { State } from "../../lib/types";

export function useStore() {
  const [state, setLocal] = useState<State>(defaultState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    getState().then((s) => {
      if (!mounted) return;
      setLocal(s);
      setReady(true);
    });
    const off = onStateChange((s) => {
      if (mounted) setLocal(s);
    });
    return () => {
      mounted = false;
      off();
    };
  }, []);

  const set = useCallback(async (patch: Partial<State>) => {
    const next = await writeState(patch);
    setLocal(next);
  }, []);

  const update = useCallback(async (fn: (s: State) => State) => {
    const next = await updateState(fn);
    setLocal(next);
  }, []);

  return { state, ready, set, update };
}
