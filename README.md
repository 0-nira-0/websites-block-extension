# just focus

Chrome extension that blocks distracting sites. Two modes: simple block, and Pomodoro (configurable focus / short break / long break / rounds).

## Build

```
npm install
npm run build
```

Output goes to `dist/`.

## Install

1. Open `chrome://extensions`
2. Enable Developer mode (top right)
3. Click "Load unpacked"
4. Select the `dist/` folder

To pick up code changes, run `npm run build` again and click the reload icon on the extension card.

## Stack

Manifest V3, React 18, TypeScript, Vite, `@crxjs/vite-plugin`, `chrome.declarativeNetRequest`, `chrome.alarms`, `chrome.storage.local`.
