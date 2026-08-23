import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run build:app && npm run preview",
    port: 4173,
  },
  testDir: "src",
  testMatch: "**/*.e2e.{ts,js}",
};

export default config;
