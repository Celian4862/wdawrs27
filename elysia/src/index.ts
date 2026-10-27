import { openapi } from '@elysia/openapi';
import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import Redis from 'ioredis';
import { customAlphabet } from 'nanoid';
import type { GameState } from '@/game/types';
import { assignPlayers } from '@/player/helpers';
import { appVersion, oneDayInSeconds } from '@/shared/data';
import { db } from './db';
import { gamesTable } from './schema';

const generateGameId = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	8,
);

const redis = new Redis(
	(() => {
		const redisUrl = process.env.REDIS_URL;

		if (!redisUrl) {
			throw new Error(
				'❌ REDIS_URL or KV_URL is missing from your environment variables. Please check your Vercel integration settings.',
			);
		}
		return redisUrl;
	})(),
);

const app = new Elysia()
	.use(
		openapi({
			documentation: {
				info: {
					title: 'wdawrs27 API Documentation',
					version: '0.0.0',
				},
			},
		}),
	)
	.onBeforeHandle(async ({ request, set }) => {
		try {
			const clientIp = request.headers.get('x-forwarded-for') ?? 'local';
			const windowKey = Math.floor(Date.now() / 60_000); // changes every minute
			const redisKey = `ratelimit:${clientIp}:${windowKey}`;

			// Increment count and set a 60-second expiration atomically
			const requests = await redis.incr(redisKey);
			if (requests === 1) {
				await redis.expire(redisKey, 60);
			} else if (requests > 10) {
				set.status = 429;
				return { error: 'Too many requests, please try again later.' };
			}
		} catch (err) {
			console.error('Redis rate-limiter failed, failing open:', err);
			// If Redis is down, we allow the request to proceed instead of crashing
		}
	})
	.get(
		'/',
		() => ({
			name: 'Game Backend API',
			status: 'online',
			version: appVersion,
			timestamp: new Date().toISOString(),
		}),
		{
			detail: {
				summary: 'Home Route',
				description: 'General API information',
			},
		},
	)
	.group('/game', (app) =>
		app
			.post(
				'/setup',
				async ({ body: { playerCount }, set }) => {
					try {
						const gameState: GameState = {
							players: assignPlayers(playerCount),
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
							[
								t.Literal('easy'),
								t.Literal('normal'),
								t.Literal('hard'),
								t.Literal('expert'),
							],
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
					.post(
						'/',
						async ({ gameId, set }) => {
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

if (import.meta.main) {
	app.listen(3000);
	console.log(
		`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
	);
}

export default app;
