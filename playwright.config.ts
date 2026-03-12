import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  use: {
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "pnpm --filter @experts/expert-portal-web dev --port 3000",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @experts/ops-console-web dev --port 3001",
      url: "http://127.0.0.1:3001",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
