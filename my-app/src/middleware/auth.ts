import { createMiddleware } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { usersTable } from "#/db/schema";

export const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		// Get the incoming HTTP request
		let token = getCookie("session_id");

		if (!token) {
			token = crypto.randomUUID();

			// Set the cookie in the user's browser (valid for 30 days)
			setCookie("session_id", token, {
				httpOnly: true,
				path: "/",
				maxAge: 2592000, // 30 days in seconds
				sameSite: "lax",
			});
		}

		// Check your SQLite DB for an active session
		const session = await db
			.select({ token: usersTable.token })
			.from(usersTable)
			.where(eq(usersTable.token, token));

		if (!session) {
			throw new Error("Unauthorized: Invalid or expired session.");
		}

		// Pass down context (like roomCode and playerNumber) to your server function!
		return next({
			context: {
				session,
			},
		});
	},
);
