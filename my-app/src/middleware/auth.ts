import { createMiddleware } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { usersTable } from "#/db/schema";

export const cookieMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		let token = getCookie("session_id");

		if (!token) {
			token = crypto.randomUUID();
			setCookie("session_id", token, {
				httpOnly: true,
				path: "/",
				maxAge: 2592000, // 30 days
				sameSite: "lax",
			});
		}

		return next({
			context: {
				token,
			},
		});
	},
);

export const isAdminMiddleware = createMiddleware({ type: "function" })
	.middleware([cookieMiddleware])
	.server(async ({ next, context: { token } }) => {
		return next({
			context: {
				isAdmin:
					(
						await db
							.select({ isAdmin: usersTable.isAdmin })
							.from(usersTable)
							.where(eq(usersTable.token, token))
					)[0]?.isAdmin ?? false,
			},
		});
	});
