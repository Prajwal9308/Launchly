/** Isolated database for Vitest. Tests truncate every table, so never point this at real data. */
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? "postgresql://launchly:launchly_dev@localhost:5432/launchly_test";
