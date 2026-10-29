import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { gamesTable } from '../../schema';
import { difficulties } from '../hurricane/data';
import { setHurricaneMeter } from '../hurricane/helpers';
import { assignPlayers } from '../player/helpers';
import { oneDayInSeconds } from '../shared/data';
import { generateGameId } from '../shared/helpers';
import { setup } from '../shared/routes';
import type { GameState } from './types';

export const gameRoutes = new Elysia().use(setup).group('/game', (app) =>
	app
		.post(
			'/setup',
			async ({ body: { playerCount, difficulty }, set }) => {
				try {
					const gameState: GameState = {
						players: assignPlayers(playerCount),
						hurricaneMeter: setHurricaneMeter(playerCount, difficulty),
					};
					const gameSession = await db
						.insert(gamesTable)
						.values({
							id: generateGameId(),
							status: 'waiting',
							stateJSON: gameState,
						})
						.returning();
					set.status = 201;
					return gameSession[0];
				} catch (e) {
					console.error(e);
					set.status = 500;
					return { error: 'Internal server error' };
				}
			},
			{
				body: t.Object({
					playerCount: t.Number({
						minimum: 2,
						maximum: 5,
						description: 'Number of users who will play',
						error: 'playerCount must be between 2 and 5 players',
					}),
					difficulty: t.Union(
						difficulties.map((difficulty) => t.Literal(difficulty)),
						{
							description: 'Game difficulty level',
							error:
								'Difficulty must be either "easy", "normal", "hard", or "expert"',
						},
					),
				}),
				detail: {
					summary: 'Game Setup',
					description: 'Required endpoint before proceeding to a game',
				},
			},
		)
		.group('/:gameId', (gameSession) =>
			gameSession
				.guard({
					params: t.Object({
						gameId: t.String({
							maxLength: 8,
							description: 'Identifies the corresponding game session',
						}),
					}),
				})
				.resolve(({ params: { gameId } }) => ({ gameId }))
				.get(
					'/',
					async ({ redis, gameId, set }) => {
						try {
							let gameSession: GameState;
							const cachedGameSession = await redis.getex(
								`url:${gameId}`,
								'EX',
								oneDayInSeconds,
							);
							if (cachedGameSession) {
								gameSession = JSON.parse(cachedGameSession) as GameState;
							}
							const queriedGameSession = await db
								.select({ stateJSON: gamesTable.stateJSON })
								.from(gamesTable)
								.where(eq(gamesTable.id, gameId));
							if (queriedGameSession.length === 0) {
								set.status = 404;
								return { error: 'Invalid game session' };
							}
							gameSession = queriedGameSession[0].stateJSON as GameState;
							return gameSession;
						} catch (e) {
							console.error(e);
							set.status = 500;
							return { error: 'Internal server error' };
						}
					},
					{
						detail: {
							summary: 'Get Game State',
							description: 'Gets the current game state of a game session',
						},
					},
				),
		),
);
