import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

export const tursoUrl = process.env.TURSO_DATABASE_URL || 'file:local.db';

export const db = drizzle({
	client: createClient({
		url: tursoUrl,
		authToken: process.env.TURSO_AUTH_TOKEN,
	}),
});
