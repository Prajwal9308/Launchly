import { execSync } from "node:child_process";
import { TEST_DATABASE_URL } from "./test-env";

/** Applies migrations to the isolated test database before any test runs. */
export default function setup() {
  if (!/test/.test(TEST_DATABASE_URL)) {
    throw new Error("Refusing to run tests: TEST_DATABASE_URL must point to a database whose name contains 'test'.");
  }
  execSync("npx prisma migrate deploy", {
    stdio: "pipe",
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
  });
}
