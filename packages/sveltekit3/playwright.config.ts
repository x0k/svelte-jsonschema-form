import type { PlaywrightTestConfig } from "@playwright/test";

// The tests all share one `vite preview` server and, between them, one
// submission store. Left to itself Playwright picks a worker per core, which on
// a many-core machine is enough concurrent load to miss the default 5s
// expectations — the failures move between tests run to run, since whichever
// request happens to be slow is the one that times out.
const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run build:app && npm run preview",
    port: 4173,
    // One server, so the concurrency that buys anything is bounded anyway.
    reuseExistingServer: !process.env.CI,
  },
  testDir: "src",
  testMatch: "**/*.e2e.{ts,js}",
  fullyParallel: true,
  workers: 3,
  // Generous enough to absorb a cold `vite preview` on a loaded CI box, while
  // still failing a genuinely broken submission rather than hanging.
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: process.env.CI ? "line" : "list",
};

export default config;
