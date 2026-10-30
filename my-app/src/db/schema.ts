import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const gamesTable = sqliteTable("games", {
	id: text("id").primaryKey(),
	title: text("status").notNull().default("waiting"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	playersJSON: text("players_json", { mode: "json" }).notNull(),
	stateJSON: text("state_json", { mode: "json" }).notNull(),
});

export type GameRecord = typeof gamesTable.$inferSelect;
export type NewGameRecord = typeof gamesTable.$inferInsert;
