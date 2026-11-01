import { createMiddleware } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware({ type: "function" }).server(
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

		return next();
	},
);
