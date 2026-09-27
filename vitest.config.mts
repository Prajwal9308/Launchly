import path from "node:path";
import { defineConfig } from "vitest/config";

const root = process.cwd();

import { TEST_DATABASE_URL } from "./tests/test-env";

export default defineConfig({
  resolve: {
    alias: {
      "@": root,
      // `server-only` throws outside React Server Components; services are plain modules in tests.
      "server-only": path.join(root, "tests/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    globalSetup: ["tests/global-setup.ts"],
    // Integration tests share one database, so files run sequentially.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: TEST_DATABASE_URL,
      AUTH_SECRET: "test-secret-not-for-production",
      STORAGE_PROVIDER: "local",
      STORAGE_LOCAL_DIR: "./storage/test-uploads",
      EMAIL_PROVIDER: "console",
      AI_PROVIDER: "none",
    },
  },
});
