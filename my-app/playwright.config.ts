import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: process.env.CI ? "bun run build && bun run preview" : "bun run dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		stdout: "pipe",
		stderr: "pipe",
		env: {
			...process.env,
			TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ?? "file:dev.db",
			REDIS_URL: process.env.REDIS_URL ?? "redis://default@127.0.0.1:6379",
		},
		timeout: 120 * 1000,
	},
});
