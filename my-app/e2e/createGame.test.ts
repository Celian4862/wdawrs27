import { expect, test } from "@playwright/test";

test.describe("game session integration", () => {
	test("creates a game room", async ({ page }) => {
		await page.goto("/");

		page.on("console", (msg) => {
			console.log(`[BROWSER ${msg.type()}]:`, msg.text());
		});

		page.on("pageerror", (err) => {
			console.log("[BROWSER PAGE ERROR]:", err.message);
		});

		page.on("response", async (res) => {
			if (res.status() >= 400) {
				const body = await res.text().catch(() => "");
				console.log(`[HTTP ${res.status()}] ${res.url()}:`, body);
			}
		});

		if (!process.env.CI) {
			await expect(
				page.getByRole("button", { name: "Open TanStack Devtools" }),
			).toBeVisible();
		}

		const playerCountGroup = page.getByRole("group", {
			name: "How many players?",
		});
		await expect(playerCountGroup).toBeVisible();
		await expect(
			playerCountGroup.getByRole("radio", { name: "2" }),
		).toBeChecked();

		const difficultyGroup = page.getByRole("group", {
			name: "What difficulty?",
		});
		await expect(difficultyGroup).toBeVisible();
		await expect(
			difficultyGroup.getByRole("radio", { name: "Easy" }),
		).toBeChecked();

		const hostNameField = page.getByLabel("Host Name");
		await hostNameField.fill("Playwright");
		await expect(hostNameField).toHaveValue("Playwright");

		await page.getByRole("button", { name: "Create Game" }).click();

		await page.getByRole("button", { name: "Create Game" }).click();
		await expect(page).toHaveURL(/\/[^/]+\/waiting\/?(\?.*)?$/);

		await page.getByRole("button", { name: "Delete Game" }).click();

		const dialog = page.getByRole("alertdialog");
		await expect(dialog).toBeVisible();
		await dialog.getByRole("button", { name: "Continue" }).click();

		await expect(dialog).toBeHidden();

		await expect(page).toHaveURL(/^https?:\/\/[^/]+\/?$/);
	});
});
