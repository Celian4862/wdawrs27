import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const tursoURL = (() => {
	const tursoURL = process.env.TURSO_DATABASE_URL;
	if (!tursoURL) {
		throw new Error("Database URL not set");
	}

	return tursoURL;
})();

export const db = drizzle({
	client: createClient({
		url: tursoURL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	}),
});
