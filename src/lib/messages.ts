export type Msg =
  | { type: "START_POMODORO" }
  | { type: "PAUSE_POMODORO" }
  | { type: "RESUME_POMODORO" }
  | { type: "STOP_POMODORO" }
  | { type: "SKIP_PHASE" }
  | { type: "ACTIVATE" }
  | { type: "DEACTIVATE" }
  | { type: "SYNC_RULES" }
  | { type: "BLOCK_HIT"; url: string };

export async function send(msg: Msg): Promise<unknown> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (resp) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(resp);
    });
  });
}
