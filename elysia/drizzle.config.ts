import { defineConfig } from 'drizzle-kit';
import { tursoUrl } from './src/db';

export default defineConfig({
	schema: './src/schema.ts',
	out: './drizzle',
	dialect: 'turso',
	dbCredentials: {
		url: tursoUrl,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
});
