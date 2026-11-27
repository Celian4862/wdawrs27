import { createServerFn } from "@tanstack/react-start";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { gamesTable, usersTable } from "#/db/schema";
import { redis } from "#/lib/redis";
import { cookieMiddleware, isAdminMiddleware } from "#/middleware/auth";
import { hurricaneId } from "../board/data";
import {
	getCurrentTileIndex,
	revealTileHelper,
	shuffleBoard,
} from "../board/helpers";
import { difficulties } from "../hurricane/data";
import { setHurricaneMeter, shuffleHurricaneDeck } from "../hurricane/helpers";
import { shuffleItemCards } from "../item/helpers";
import {
	assignPlayers,
	getCurrentPlayer,
	shufflePlayers,
} from "../player/helpers";
import { oneDayInSeconds } from "../shared/data";
import { generateGameId } from "../shared/helpers";
import { adminOnlyMessage } from "./data";
import type { GameInfo, GameState, GameStatus } from "./types";

async function setRedisCache(gameId: string, newGameState: GameState) {
	await redis.setex(
		`url:${gameId}`,
		oneDayInSeconds,
		JSON.stringify(newGameState),
	);
}

export const getUserSessionStatus = createServerFn({ method: "GET" })
	.middleware([cookieMiddleware])
	.handler(
		async ({
			context: { token },
		}): Promise<{
			gameId: string;
			status: GameStatus;
		}> => {
			const [userSession] = await db
				.select({ gameId: usersTable.gameId, status: gamesTable.status })
				.from(usersTable)
				.where(eq(usersTable.token, token))
				.innerJoin(gamesTable, eq(usersTable.gameId, gamesTable.id));

			return {
				gameId: userSession?.gameId ?? "",
				status: userSession?.status ?? "waiting",
			};
		},
	);

export const joinGame = createServerFn({ method: "POST" })
	.middleware([cookieMiddleware])
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
					playerCount: gamesTable.playerCount,
					roles: gamesTable.roles,
					stateJSON: gamesTable.stateJSON,
				})
				.from(gamesTable)
				.where(eq(gamesTable.id, gameId));

			if (!game) {
				throw new Error("Game not found.");
			}

			if (game.status === "finished") {
				throw new Error("Game has already ended");
			}

			const [playerWithName] = await tx
				.select({ playerName: usersTable.playerName })
				.from(usersTable)
				.where(
					and(
						eq(usersTable.gameId, gameId),
						eq(usersTable.playerName, playerName),
					),
				);

			if (playerWithName) {
				throw new Error("Player name already exists");
			}

			// 3. Insert user into usersTable for this room
			const [gamePlayers] = await tx
				.select({ count: count() })
				.from(usersTable)
				.where(eq(usersTable.gameId, gameId));

			if (gamePlayers.count < game.playerCount) {
				await tx.insert(usersTable).values({
					token,
					gameId,
					isAdmin: false,
					playerName: playerName,
					role: game.roles[gamePlayers.count],
				});
			} else {
				throw new Error("This game room is full.");
			}
		});
		return {};
	});

export const setupGame = createServerFn({ method: "POST" })
	.middleware([cookieMiddleware])
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
			const roles = shufflePlayers(playerCount);
			// If we passed a debug state (and we aren't in production), use it!
			const gameState: GameState =
				debugInitialState && process.env.NODE_ENV !== "production"
					? debugInitialState
					: {
							actionCount: 4,
							board: shuffleBoard(),
							players: assignPlayers(roles),
							hurricaneDeck: shuffleHurricaneDeck(),
							drawnHurricaneCard: { type: "None" },
							hurricaneDrawStatus: null,
							hurricaneMeter: setHurricaneMeter(playerCount, difficulty),
							itemDeck: shuffleItemCards(),
							drawnItemCard: "",
							partsCollected: [],
						};

			const newGameId = generateGameId();

			const [gameSession] = await db
				.insert(gamesTable)
				.values({
					id: newGameId,
					status: "waiting",
					playerCount,
					difficulty,
					roles,
					stateJSON: gameState,
				})
				.returning();

			await db.insert(usersTable).values({
				token,
				gameId: newGameId,
				isAdmin: true,
				playerName,
				role: roles[0],
			});

			// Cache initial state to Redis as well for fast reads
			await setRedisCache(newGameId, gameState);

			return gameSession;
		},
	);

export const getWaitingRoomInfo = createServerFn({ method: "GET" })
	.middleware([isAdminMiddleware])
	.validator(z.object({ gameId: z.string().min(8).max(8) }))
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
	.middleware([isAdminMiddleware])
	.validator(z.object({ gameId: z.string().min(8).max(8) }))
	.handler(async ({ data: { gameId }, context: { isAdmin } }) => {
		if (!isAdmin) {
			throw new Error(adminOnlyMessage);
		}

		await db.delete(gamesTable).where(eq(gamesTable.id, gameId));
		await redis.del(`url:${gameId}`);
	});

export const startGame = createServerFn({ method: "POST" })
	.middleware([isAdminMiddleware])
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

export const getGameState = createServerFn({ method: "GET" })
	.middleware([isAdminMiddleware])
	.validator(z.object({ gameId: z.string().min(8).max(8) }))
	.handler(
		async ({ data: { gameId }, context: { isAdmin } }): Promise<GameInfo> => {
			let gameStateResult: GameInfo;
			// 1. Try reading from Redis Cache first
			const cachedGameState = await redis.getex(
				`url:${gameId}`,
				"EX",
				oneDayInSeconds,
			);

			if (cachedGameState) {
				gameStateResult = {
					...JSON.parse(cachedGameState),
					isAdmin,
				};
			} else {
				// 2. Fallback to Turso DB
				const [queriedGame] = await db
					.select({ stateJSON: gamesTable.stateJSON })
					.from(gamesTable)
					.where(eq(gamesTable.id, gameId));

				if (!queriedGame) {
					throw new Error("Invalid game session");
				}

				const gameState = queriedGame.stateJSON;

				// Cache back to Redis for subsequent reads
				await setRedisCache(gameId, gameState);

				gameStateResult = {
					...gameState,
					isAdmin,
				};
			}

			return gameStateResult;
		},
	);

export const getUserInfo = createServerFn({ method: "GET" })
	.middleware([cookieMiddleware])
	.validator(z.object({ gameId: z.string().min(8).max(8) }))
	.handler(async ({ data: { gameId }, context: { token } }) => {
		const userInfo = await db
			.select({
				token: usersTable.token,
				playerName: usersTable.playerName,
				role: usersTable.role,
			})
			.from(usersTable)
			.where(eq(usersTable.gameId, gameId));

		if (userInfo.length === 0) {
			throw new Error("Game not found");
		}

		return Object.fromEntries(
			userInfo.map((user) => [
				user.role,
				{ isYou: user.token === token, playerName: user.playerName },
			]),
		);
	});

export const revealTile = createServerFn({ method: "POST" })
	.middleware([cookieMiddleware])
	.handler(async ({ context: { token } }) => {
		const [userInfo] = await db
			.select({
				role: usersTable.role,
				gameId: usersTable.gameId,
			})
			.from(usersTable)
			.where(eq(usersTable.token, token));

		if (!userInfo) {
			throw new Error("You must join a game first");
		}

		const gameInfo = await getGameState({ data: { gameId: userInfo.gameId } });
		const { isAdmin, ...gameState } = gameInfo;
		const currentPlayer = getCurrentPlayer(gameState.players);

		if (currentPlayer.roleKey !== userInfo.role) {
			throw new Error("It is not yet your turn");
		}

		const currentTileIndex = getCurrentTileIndex(
			gameState.board,
			currentPlayer,
		);

		if (gameState.board[currentTileIndex].id === hurricaneId) {
			throw new Error("Tile index is invalid");
		}

		if (gameState.board[currentTileIndex].revealed) {
			throw new Error("Tile is already revealed");
		}

		const newGameState: GameState = {
			...gameState,
			actionCount: gameState.actionCount - 1,
			board: revealTileHelper(gameState.board, currentPlayer),
		};

		await db.transaction(async (tx) => {
			return await tx
				.update(gamesTable)
				.set({ stateJSON: newGameState })
				.where(eq(gamesTable.id, userInfo.gameId));
		});

		await setRedisCache(userInfo.gameId, newGameState);
	});
