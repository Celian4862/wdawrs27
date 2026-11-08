import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { gamesTable, usersTable } from "#/db/schema";
import { redis } from "#/lib/redis";
import { authMiddleware } from "#/middleware/auth";
import type { GameState, GameStatus } from "./features/game/types";
import { difficulties } from "./features/hurricane/data";
import { setHurricaneMeter } from "./features/hurricane/helpers";
import { assignPlayers, getRoleTitle } from "./features/player/helpers";
import { oneDayInSeconds } from "./features/shared/data";
import { generateGameId } from "./features/shared/helpers";

const adminOnlyMessage = "Only admins may perform this action.";

export const getUserSessionStatus = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context: { token } }) => {
		const [userSession] = await db
			.select({ gameId: usersTable.gameId, status: gamesTable.status })
			.from(usersTable)
			.where(eq(usersTable.token, token))
			.innerJoin(gamesTable, eq(usersTable.gameId, gamesTable.id));

		return {
			gameId: userSession?.gameId ?? "",
			status: userSession?.status ?? "waiting",
		} as {
			gameId: string;
			status: GameStatus;
		};
	});

export const joinGame = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: { gameId: string; playerName: string }) => {
		const result = z
			.object({
				gameId: z.string().length(8),
				playerName: z.string().min(1).max(10),
			})
			.safeParse(data);

		if (!result?.data) {
			throw new Error("Invalid game ID.");
		}

		return result.data;
	})
	.handler(async ({ data: { gameId, playerName }, context: { token } }) => {
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

			const [playerWithName] = await tx
				.select({ playerName: usersTable.playerName })
				.from(usersTable)
				.where(eq(usersTable.playerName, playerName));

			if (playerWithName) {
				throw new Error("Player name already exists");
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
					playerName: playerName,
					role: getRoleTitle(gameState.players[gamePlayers.count].roleKey),
				});
			} else {
				throw new Error("This game room is full.");
			}
		});
		return {};
	});

/**
 * Setup Game Session Function
 * Replaces: POST /game/setup
 */
export const setupGame = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(
		z.object({
			playerCount: z.number().min(2).max(5),
			difficulty: z.enum(difficulties),
			playerName: z.string().min(1).max(10),
			// 👇 Optional override for testing specific scenarios
			debugInitialState: z.custom<GameState>().optional(),
		}),
	)
	.handler(
		async ({
			data: { playerCount, difficulty, playerName, debugInitialState },
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
					playerCount,
					difficulty,
					stateJSON: gameState,
				})
				.returning();

			await db.insert(usersTable).values({
				token,
				gameId: newGameId,
				isAdmin: true,
				playerName,
				role: getRoleTitle(gameState.players[0].roleKey),
			});

			// Cache initial state to Redis as well for fast reads
			await redis.setex(
				`url:${newGameId}`,
				oneDayInSeconds,
				JSON.stringify(gameState),
			);

			return gameSession as {
				id: string;
				status: string;
				playerCount: number;
				difficulty: string;
				createdAt: Date;
				stateJSON: GameState;
			};
		},
	);

export const getWaitingRoomInfo = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator(
		z.object({
			gameId: z.string().min(8).max(8),
		}),
	)
	.handler(async ({ data: { gameId }, context: { isAdmin } }) => {
		const [gameRoomInfo] = await db
			.select({
				status: gamesTable.status,
				playerCount: gamesTable.playerCount,
				difficulty: gamesTable.difficulty,
			})
			.from(gamesTable)
			.where(eq(gamesTable.id, gameId));

		if (!gameRoomInfo) {
			throw new Error("Game not found.");
		}

		const users = await db
			.select({
				is_admin: usersTable.isAdmin,
				playerName: usersTable.playerName,
			})
			.from(usersTable)
			.where(eq(usersTable.gameId, gameId));

		if (users.length === 0) {
			throw new Error("This game has no players.");
		}

		return { gameRoomInfo, users, userIsAdmin: isAdmin } as {
			gameRoomInfo: {
				status: GameStatus;
				playerCount: number;
				difficulty: string;
			};
			users: { is_admin: boolean; playerName: string }[];
			userIsAdmin: boolean;
		};
	});

export const deleteGame = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ gameId: z.string().min(8).max(8) }))
	.handler(async ({ data: { gameId }, context: { isAdmin } }) => {
		if (!isAdmin) {
			throw new Error(adminOnlyMessage);
		}

		await db.delete(gamesTable).where(eq(gamesTable.id, gameId));
	});

export const startGame = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ gameId: z.string().min(8).max(8) }))
	.handler(async ({ data: { gameId }, context: { isAdmin } }) => {
		if (!isAdmin) {
			throw new Error(adminOnlyMessage);
		}

		await db
			.update(gamesTable)
			.set({ status: "started" satisfies GameStatus })
			.where(eq(gamesTable.id, gameId));
	});

/**
 * Get Game State Function
 * Replaces: GET /game/:gameId
 */
export const getGameState = createServerFn({ method: "GET" })
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
