import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { gamesTable } from "#/db/schema";
import { redis } from "#/lib/redis";
import type { GameState } from "./features/game/types";
import { difficulties } from "./features/hurricane/data";
import { setHurricaneMeter } from "./features/hurricane/helpers";
import { assignPlayers } from "./features/player/helpers";
import { oneDayInSeconds } from "./features/shared/data";
import { generateGameId } from "./features/shared/helpers";

/**
 * Setup Game Session Function
 * Replaces: POST /game/setup
 */
export const setupGame = createServerFn({ method: "POST", strict: false })
	.validator(
		z.object({
			playerCount: z.number().min(2).max(5),
			difficulty: z.enum(difficulties),
			// 👇 Optional override for testing specific scenarios
			debugInitialState: z.custom<GameState>().optional(),
		}),
	)
	.handler(async ({ data }) => {
		const { playerCount, difficulty, debugInitialState } = data;

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
				playersJSON: {},
				stateJSON: gameState,
			})
			.returning();

		// Cache initial state to Redis as well for fast reads
		await redis.setex(
			`url:${newGameId}`,
			oneDayInSeconds,
			JSON.stringify(gameState),
		);

		return gameSession;
	});

/**
 * Get Game State Function
 * Replaces: GET /game/:gameId
 */
export const getGameState = createServerFn({ method: "GET", strict: false })
	.validator((gameId: string) => {
		if (!gameId || gameId.length > 8) {
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
