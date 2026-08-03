# Chrome / Chromium Command-Line Arguments — Playwright Reference

Chrome ships ~1,500 switches. Full canonical dump: https://peter.sh/experiments/chromium-command-line-switches/
This file lists the ones that actually matter in test automation, grouped by purpose.

> Playwright already launches Chromium with ~60 default args (`--disable-background-networking`, `--no-first-run`, etc.). Your args are appended, not replacing them. Use `ignoreDefaultArgs` to drop a default.

---

## 1. Where to Put Args

### Per project (playwright.config.ts)
```ts
projects: [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      viewport: { width: 1920, height: 1080 },
      launchOptions: {
        args: ['--start-maximized', '--disable-gpu'],
      },
    },
  },
],
```

### Global (top-level `use`)
```ts
use: {
  launchOptions: { args: ['--lang=en-GB'] },
},
```

### In code (manual launch)
```ts
const browser = await chromium.launch({
  headless: false,
  args: ['--start-maximized'],
});
```

### Drop a Playwright default
```ts
launchOptions: {
  ignoreDefaultArgs: ['--disable-extensions'],   // array = drop these
  // ignoreDefaultArgs: true,                    // true = drop ALL defaults (risky)
}
```

---

## 2. Window / Display

| Arg | What it does |
|---|---|
| `--start-maximized` | Open maximized. Needs `viewport: null` to actually fill screen |
| `--start-fullscreen` | Fullscreen, no chrome UI |
| `--kiosk` | Kiosk mode, no UI, no exit |
| `--window-size=1920,1080` | Fixed OS window size |
| `--window-position=0,0` | Where window opens (multi-monitor) |
| `--force-device-scale-factor=1` | Pin DPI scaling. Kills retina blur in screenshots |
| `--hide-scrollbars` | No scrollbars. Stabilizes visual diffs |
| `--force-color-profile=srgb` | Consistent colors across machines. Use for screenshot tests |

**`--start-maximized` gotcha:**
```ts
use: {
  viewport: null,                                  // required
  launchOptions: { args: ['--start-maximized'] },
}
```
Without `viewport: null` Playwright forces its own viewport: window looks maximized but page is not.

---

## 3. Headless / Rendering

| Arg | What it does |
|---|---|
| `--headless=new` | New headless mode (real Chrome engine). Playwright handles via `headless: true` |
| `--disable-gpu` | No GPU accel. Classic CI/Docker fix |
| `--disable-software-rasterizer` | Pair with `--disable-gpu` |
| `--use-gl=swiftshader` | Software GL. Fixes WebGL in headless |
| `--enable-unsafe-swiftshader` | Allow SwiftShader for WebGL when GPU blocked |
| `--disable-dev-shm-usage` | **Docker must-have.** /dev/shm too small (64MB) -> tab crashes |
| `--no-sandbox` | Disable sandbox. Needed for root-in-Docker. See note below |
| `--disable-setuid-sandbox` | Companion to `--no-sandbox` |
| `--single-process` | One process. Low memory, unstable. Last resort |
| `--disable-accelerated-2d-canvas` | Canvas software render |

**Security note on `--no-sandbox`:** it removes Chrome's process sandbox, so a renderer exploit from any page you visit runs with your user's privileges. Only acceptable inside a disposable CI container hitting trusted URLs. Never on a laptop that also browses arbitrary sites. Better fix: run the container as a non-root user, or add `--cap-add=SYS_ADMIN`, instead of disabling the sandbox.

---

## 4. Incognito / Profile / State

| Arg | What it does |
|---|---|
| `--incognito` | Incognito window. Mostly pointless in Playwright (every context already isolated). Breaks with plain Chromium; only try with `channel: 'chrome'` |
| `--user-data-dir=/path` | Persistent profile dir. Use `launchPersistentContext()` instead |
| `--profile-directory=Default` | Which profile inside user-data-dir |
| `--guest` | Guest session |
| `--disable-extensions` | No extensions (Playwright default) |
| `--load-extension=/path` | Load unpacked extension. Requires persistent context + headed |
| `--disable-extensions-except=/path` | Allow only that extension |

---

## 5. Security / Certificates / CORS

| Arg | What it does |
|---|---|
| `--ignore-certificate-errors` | Accept bad SSL. Prefer Playwright `ignoreHTTPSErrors: true` |
| `--allow-insecure-localhost` | Trust localhost self-signed certs |
| `--disable-web-security` | Turn off same-origin policy. Needs `--user-data-dir` to take effect |
| `--allow-running-insecure-content` | Mixed content allowed |
| `--unsafely-treat-insecure-origin-as-secure=http://host` | Treat HTTP origin as secure (getUserMedia, service workers) |
| `--disable-site-isolation-trials` | Off cross-site process isolation. Helps some iframe/CDP work |
| `--host-resolver-rules="MAP * 127.0.0.1"` | DNS override without editing /etc/hosts |

`--disable-web-security` disables the browser's core origin boundary: any page can then read any other origin's responses, cookies included. Use only against test fixtures you control, in a throwaway profile, never in a session signed into real accounts. Where possible, assert the app's CORS headers instead.

---

## 6. Network / Proxy

| Arg | What it does |
|---|---|
| `--proxy-server=http://host:port` | Proxy. Prefer Playwright `proxy` option |
| `--proxy-bypass-list=<-loopback>` | Skip proxy for these hosts |
| `--no-proxy-server` | Force direct |
| `--disable-background-networking` | No telemetry/update chatter (Playwright default) |
| `--enable-features=NetworkServiceInProcess` | Debug net stack in-process |

---

## 7. Permissions / Media / Devices

| Arg | What it does |
|---|---|
| `--use-fake-ui-for-media-stream` | Auto-accept camera/mic prompt |
| `--use-fake-device-for-media-stream` | Fake webcam (green rolling pattern) |
| `--use-file-for-fake-video-capture=/path.y4m` | Feed a video file as webcam |
| `--use-file-for-fake-audio-capture=/path.wav` | Feed audio file as mic |
| `--auto-select-desktop-capture-source=Entire screen` | Auto-pick screen share target |
| `--allow-file-access-from-files` | file:// pages can XHR other files |
| `--autoplay-policy=no-user-gesture-required` | Video autoplays without click |
| `--deny-permission-prompts` | Auto-deny all permission prompts |

---

## 8. Popups / Dialogs / Noise

| Arg | What it does |
|---|---|
| `--disable-popup-blocking` | Allow window.open |
| `--disable-notifications` | Kill web push prompts |
| `--no-first-run` | Skip first-run wizard (Playwright default) |
| `--no-default-browser-check` | Skip "make Chrome default" (Playwright default) |
| `--disable-infobars` | Hide "controlled by automated software" bar (mostly ignored in modern Chrome) |
| `--disable-save-password-bubble` | No password save prompt |
| `--disable-translate` | No translate bar |
| `--disable-search-engine-choice-screen` | Skip EU search-engine picker |
| `--password-store=basic` | Skip OS keyring prompt on Linux |
| `--use-mock-keychain` | Same, macOS |

---

## 9. Performance / Stability in CI

| Arg | What it does |
|---|---|
| `--disable-dev-shm-usage` | Docker shared-memory fix. **Most important CI arg** |
| `--disable-background-timer-throttling` | Timers keep firing in background tabs |
| `--disable-backgrounding-occluded-windows` | No throttle when window hidden |
| `--disable-renderer-backgrounding` | Renderer stays full speed |
| `--disable-ipc-flooding-protection` | High-frequency messages allowed |
| `--disable-hang-monitor` | No "page unresponsive" dialog |
| `--disable-client-side-phishing-detection` | Less background work |
| `--disable-component-update` | No component downloads mid-run |
| `--disable-default-apps` | No bundled apps |
| `--metrics-recording-only` | Record metrics, do not upload |
| `--mute-audio` | Silence CI machines |
| `--js-flags="--max-old-space-size=4096"` | Raise V8 heap for huge pages |

---

## 10. Locale / Theme / UA

| Arg | What it does |
|---|---|
| `--lang=en-US` | UI + `navigator.language` |
| `--accept-lang=en-US,en` | Accept-Language header |
| `--force-dark-mode` | Force dark UI |
| `--enable-features=WebContentsForceDark` | Force dark page content |
| `--user-agent="..."` | Custom UA. Prefer Playwright `userAgent` |

Timezone is NOT an arg. Use Playwright `timezoneId: 'Asia/Kolkata'` or the `TZ` env var.

---

## 11. Debugging / DevTools / Tracing

| Arg | What it does |
|---|---|
| `--auto-open-devtools-for-tabs` | DevTools opens with page |
| `--remote-debugging-port=9222` | CDP endpoint. Playwright sets its own; overriding can break the connection |
| `--remote-debugging-address=0.0.0.0` | Expose CDP outside container |
| `--enable-logging --v=1` | Verbose Chrome log |
| `--log-level=0` | 0=INFO 1=WARNING 2=ERROR 3=FATAL |
| `--dump-dom` | Print DOM and exit (headless one-shot) |
| `--virtual-time-budget=5000` | Fast-forward timers, then screenshot |
| `--trace-startup` | Startup perf trace |

---

## 12. Downloads / Printing

| Arg | What it does |
|---|---|
| `--disable-print-preview` | Print goes straight to backend |
| `--kiosk-printing` | Auto-print, no dialog |
| `--disable-features=DownloadBubble,DownloadBubbleV2` | Old download bar behavior |

Download path in Playwright: `context.on('download')` + `download.saveAs()`. Not an arg.

---

## 13. Feature Flags (the two meta-switches)

```
--enable-features=Flag1,Flag2
--disable-features=Flag1,Flag2
```
Everything experimental hangs off these. Common ones:

| Feature | Use |
|---|---|
| `--disable-features=IsolateOrigins,site-per-process` | Flatten process model, easier iframe/CDP work |
| `--disable-features=Translate` | Kill translate |
| `--disable-features=BlockInsecurePrivateNetworkRequests` | Allow local-network requests from public pages |
| `--disable-features=AutomationControlled` | Removes `navigator.webdriver` flag |
| `--enable-features=NetworkService,NetworkServiceInProcess` | Net stack debugging |

---

## 14. Copy-Paste Configs

### CI / Docker
```ts
launchOptions: {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--mute-audio',
  ],
}
```
(`--no-sandbox` here assumes a disposable container hitting your own app. Drop it if the container runs as non-root.)

### Local headed demo
```ts
use: {
  headless: false,
  viewport: null,
  launchOptions: {
    args: ['--start-maximized', '--disable-notifications', '--disable-popup-blocking'],
    slowMo: 300,
  },
}
```

### Visual regression stability
```ts
launchOptions: {
  args: [
    '--force-device-scale-factor=1',
    '--force-color-profile=srgb',
    '--hide-scrollbars',
    '--disable-lcd-text',
    '--font-render-hinting=none',
  ],
}
```

### Video call / WebRTC test
```ts
launchOptions: {
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--use-file-for-fake-video-capture=./fixtures/sample.y4m',
  ],
}
```

---

## 15. Playwright Option vs Chrome Arg

Prefer the Playwright option. It works across Chromium, Firefox, WebKit.

| Need | Playwright option | Chrome arg (avoid) |
|---|---|---|
| Viewport | `viewport: {width, height}` | `--window-size` |
| User agent | `userAgent: '...'` | `--user-agent` |
| Locale | `locale: 'en-GB'` | `--lang` |
| Timezone | `timezoneId: 'Asia/Kolkata'` | none |
| Proxy | `proxy: {server}` | `--proxy-server` |
| Bad SSL | `ignoreHTTPSErrors: true` | `--ignore-certificate-errors` |
| Permissions | `permissions: ['geolocation']` | various |
| Geolocation | `geolocation: {lat, lon}` | none |
| Downloads | `acceptDownloads: true` | none |
| Incognito | default (new context per test) | `--incognito` |
| Headless | `headless: true` | `--headless=new` |
| Device scale | `deviceScaleFactor: 2` | `--force-device-scale-factor` |

---

## 16. Debug: What Args Did Playwright Actually Use?

```bash
DEBUG=pw:browser npx playwright test
```
Prints the full launch command line, defaults plus yours.

Or at runtime:
```ts
// chrome://version shows the live command line
await page.goto('chrome://version');
console.log(await page.locator('#command_line').textContent());
```

---

## In Simple Terms

- Playwright already sets sane defaults. Add args only to fix a specific problem.
- CI breaks -> `--disable-dev-shm-usage` first; `--no-sandbox` only in a throwaway container.
- Maximized window -> `--start-maximized` + `viewport: null`.
- Incognito -> already have it, do nothing.
- Anything a Playwright option covers, use the option, not the arg.
