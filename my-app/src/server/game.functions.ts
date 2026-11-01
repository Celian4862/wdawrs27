import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { gamesTable, usersTable } from "#/db/schema";
import { redis } from "#/lib/redis";
import { authMiddleware } from "#/middleware/auth";
import type { GameState } from "./features/game/types";
import { difficulties } from "./features/hurricane/data";
import { setHurricaneMeter } from "./features/hurricane/helpers";
import { assignPlayers, getRoleTitle } from "./features/player/helpers";
import { oneDayInSeconds } from "./features/shared/data";
import { generateGameId } from "./features/shared/helpers";

export const getUserSessionStatus = createServerFn({
	method: "GET",
	strict: false,
})
	.middleware([authMiddleware])
	.handler(async ({ context: { token } }) => {
		const [userRecord] = await db
			.select({ gameId: usersTable.gameId })
			.from(usersTable)
			.where(eq(usersTable.token, token));

		return {
			activeGameId: userRecord?.gameId ?? null,
		};
	});

export const joinGame = createServerFn({ method: "POST", strict: false })
	.middleware([authMiddleware])
	.validator((gameId: string) => {
		const schema = z.string().length(8);
		const result = schema.safeParse(gameId);

		if (!result?.data) {
			throw new Error("Invalid game ID.");
		}

		return result.data;
	})
	.handler(async ({ data: gameId, context: { token } }) => {
		await db.transaction(async (tx) => {
			// 1. Check if game exists and is waiting
			const [game] = await tx
				.select({
					status: gamesTable.status,
					stateJSON: gamesTable.stateJSON,
				})
				.from(gamesTable)
				.where(eq(gamesTable.id, gameId));

			if (!game) {
				throw new Error("Game not found.");
			}

			if (game.status !== "waiting") {
				throw new Error("Game has already started or ended");
			}

			// 2. Check if user is already in this game (re-entry)
			const [existingUser] = await tx
				.select({ gameId: usersTable.gameId })
				.from(usersTable)
				.where(eq(usersTable.token, token));

			if (existingUser) {
				if (existingUser.gameId === gameId) return;
				throw new Error("You are already in a different active game.");
			}

			// 3. Insert user into usersTable for this room
			const gameState = game.stateJSON as GameState;
			const [gamePlayers] = await tx
				.select({ count: count() })
				.from(usersTable)
				.where(eq(usersTable.gameId, gameId));

			if (gamePlayers.count < gameState.players.length) {
				await tx.insert(usersTable).values({
					token,
					gameId,
					isAdmin: false,
					role: getRoleTitle(gameState.players[gamePlayers.count].roleKey),
				});
			} else {
				throw new Error("This game room is full.");
			}
		});
		return { success: true };
	});

/**
 * Setup Game Session Function
 * Replaces: POST /game/setup
 */
export const setupGame = createServerFn({ method: "POST", strict: false })
	.middleware([authMiddleware])
	.validator(
		z.object({
			playerCount: z.number().min(2).max(5),
			difficulty: z.enum(difficulties),
			// 👇 Optional override for testing specific scenarios
			debugInitialState: z.custom<GameState>().optional(),
		}),
	)
	.handler(
		async ({
			data: { playerCount, difficulty, debugInitialState },
			context: { token },
		}) => {
			// If we passed a debug state (and we aren't in production), use it!
			const gameState: GameState =
				debugInitialState && process.env.NODE_ENV !== "production"
					? debugInitialState
					: {
							players: assignPlayers(playerCount),
							hurricaneMeter: setHurricaneMeter(playerCount, difficulty),
						};

			const newGameId = generateGameId();

			const [gameSession] = await db
				.insert(gamesTable)
				.values({
					id: newGameId,
					status: "waiting",
					stateJSON: gameState,
				})
				.returning();

			await db.insert(usersTable).values({
				token,
				gameId: newGameId,
				isAdmin: true,
				role: getRoleTitle(gameState.players[0].roleKey),
			});

			// Cache initial state to Redis as well for fast reads
			await redis.setex(
				`url:${newGameId}`,
				oneDayInSeconds,
				JSON.stringify(gameState),
			);

			return gameSession;
		},
	);

/**
 * Get Game State Function
 * Replaces: GET /game/:gameId
 */
export const getGameState = createServerFn({ method: "GET", strict: false })
	.middleware([authMiddleware])
	.validator((gameId: string) => {
		if (!gameId || gameId.length < 8 || gameId.length > 8) {
			throw new Error("Invalid game ID format");
		}
		return gameId;
	})
	.handler(async ({ data: gameId }) => {
		// 1. Try reading from Redis Cache first
		const cachedGameSession = await redis.getex(
			`url:${gameId}`,
			"EX",
			oneDayInSeconds,
		);

		if (cachedGameSession) {
			return JSON.parse(cachedGameSession) as GameState;
		}

		// 2. Fallback to Turso DB
		const [queriedGame] = await db
			.select({ stateJSON: gamesTable.stateJSON })
			.from(gamesTable)
			.where(eq(gamesTable.id, gameId));

		if (!queriedGame) {
			throw new Error("Invalid game session");
		}

		const gameState = queriedGame.stateJSON as GameState;

		// Cache back to Redis for subsequent reads
		await redis.setex(
			`url:${gameId}`,
			oneDayInSeconds,
			JSON.stringify(gameState),
		);

		return gameState;
	});
