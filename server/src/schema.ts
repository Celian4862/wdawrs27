import { sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const gamesTable = sqliteTable('games', {
	id: text('id').primaryKey(),
	status: text('status').notNull().default('waiting'),
	createdAt: int('created_at').notNull().default(sql`(unixepoch())`),
	stateJSON: text('state_json', {
		mode: 'json',
	}).notNull(),
});

export type GameRecord = typeof gamesTable.$inferSelect;
export type NewGameRecord = typeof gamesTable.$inferInsert;
