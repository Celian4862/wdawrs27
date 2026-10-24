import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

export const tursoUrl = (() => {
	const tursoUrl = process.env.TURSO_DATABASE_URL;

	if (!tursoUrl) {
		throw new Error(
			'❌ TURSO_DATABASE_URL is missing from your environment variables. Please check your .env file or Vercel dashboard.',
		);
	}
	return tursoUrl;
})();

export const db = drizzle({
	client: createClient({
		url: tursoUrl,
		authToken: process.env.TURSO_AUTH_TOKEN,
	}),
});
