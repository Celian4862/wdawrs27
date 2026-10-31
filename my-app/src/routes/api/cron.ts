import { createFileRoute } from "@tanstack/react-router";
import { lt, sql } from "drizzle-orm";
import { db } from "#/db";
import { gamesTable } from "#/db/schema";

export const Route = createFileRoute("/api/cron")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				// Optional: Secure your cron endpoint so random actors can't trigger it.
				// Vercel automatically includes an Authorization header with your project's cron secret.
				const authHeader = request.headers.get("authorization");
				if (
					process.env.NODE_ENV === "production" &&
					authHeader !== `Bearer ${process.env.CRON_SECRET}`
				) {
					return new Response("Unauthorized", { status: 401 });
				}

				try {
					await db
						.delete(gamesTable)
						.where(lt(gamesTable.createdAt, sql`(unixepoch() - 86400)`));

					console.log("Cron job executed successfully");

					return Response.json({ success: true, timestamp: Date.now() });
				} catch (error) {
					console.error("Cron job failed:", error);
					return new Response("Internal Server Error", { status: 500 });
				}
			},
		},
	},
});
