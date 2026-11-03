import { sql } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	text,
	unique,
} from "drizzle-orm/sqlite-core";

export const gamesTable = sqliteTable("games", {
	id: text("id").primaryKey(),
	status: text("status").notNull().default("waiting"),
	playerCount: integer("player_count", { mode: "number" }).notNull(),
	difficulty: text("difficulty").notNull(),
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
		playerName: text("player_name", { mode: "text" }).notNull(),
		role: text("role", { mode: "text" }).notNull(),
	},
	(table) => [
		index("users_game_id_idx").on(table.gameId),
		unique("unique_users_name_game_id").on(table.gameId, table.playerName),
		unique("unique_users_role_game_id").on(table.gameId, table.role),
	],
);
