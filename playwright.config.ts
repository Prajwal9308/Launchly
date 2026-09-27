import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3211);
const BASE_URL = `http://localhost:${PORT}`;
const E2E_DATABASE_URL = process.env.E2E_DATABASE_URL ?? "postgresql://launchly:launchly_dev@localhost:5432/launchly_e2e";

/**
 * End-to-end tests run against a production build using an isolated,
 * freshly seeded database (see tests/e2e/prepare-db.ts).
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, testIgnore: /mobile\.spec\.ts/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
  ],
  webServer: {
    command: `npx tsx tests/e2e/prepare-db.ts && npx next build && npx next start -p ${PORT}`,
    url: BASE_URL,
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL: E2E_DATABASE_URL,
      AUTH_SECRET: "e2e-secret-not-for-production-000000000",
      AUTH_URL: BASE_URL,
      APP_URL: BASE_URL,
      STORAGE_PROVIDER: "local",
      STORAGE_LOCAL_DIR: "./storage/e2e-uploads",
      EMAIL_PROVIDER: "console",
      AI_PROVIDER: "none",
      SEED_DEV_PASSWORD: "Launchly-dev-2026",
    },
  },
});
