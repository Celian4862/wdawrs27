import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const gamesTable = sqliteTable("games", {
	id: text("id").primaryKey(),
	status: text("status").notNull().default("waiting"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	stateJSON: text("state_json", { mode: "json" }).notNull(),
});

export type GameRecord = typeof gamesTable.$inferSelect;
export type NewGameRecord = typeof gamesTable.$inferInsert;

export const usersTable = sqliteTable(
	"users",
	{
		token: text("token").primaryKey(),
		gameId: text("game_id")
			.notNull()
			.references(() => gamesTable.id, { onDelete: "cascade" }),
		isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
		role: text("role", { mode: "text" }).notNull(),
	},
	(table) => [index("users_game_id_idx").on(table.gameId)],
);
