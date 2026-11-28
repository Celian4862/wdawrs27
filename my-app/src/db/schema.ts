import { sql } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	text,
	unique,
} from "drizzle-orm/sqlite-core";
import type { GameState, GameStatus } from "#/server/game/types";
import type { Difficulty } from "#/server/hurricane/types";
import type { RoleKey } from "#/server/player/types";

export const gamesTable = sqliteTable("games", {
	id: text("id").primaryKey(),
	status: text("status").$type<GameStatus>().notNull().default("waiting"),
	playerCount: integer("player_count", { mode: "number" }).notNull(),
	difficulty: text("difficulty").$type<Difficulty>().notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	// For randomizing role assignments
	roles: text("roles", { mode: "json" }).$type<RoleKey[]>().notNull(),
	stateJSON: text("state_json", { mode: "json" }).$type<GameState>().notNull(),
	stateVersion: integer("state_version").notNull().default(0),
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
		role: text("role", { mode: "text" }).$type<RoleKey>().notNull(),
	},
	(table) => [
		index("users_game_id_idx").on(table.gameId),
		unique("unique_users_name_game_id").on(table.gameId, table.playerName),
		unique("unique_users_role_game_id").on(table.gameId, table.role),
	],
);
