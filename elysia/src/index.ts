import { openapi } from '@elysia/openapi';
import { Elysia, t } from 'elysia';
import Redis from 'ioredis';
import { customAlphabet } from 'nanoid';
import type { GameState } from '@/game/types';
import { assignPlayers } from '@/player/helpers';
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
	.use(openapi())
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
	.get('/', () => ({
		name: 'Game Backend API',
		status: 'online',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
	}))
	.group('/game', (app) =>
		app
			.post(
				'/setup',
				async ({ body: { playerCount }, set }) => {
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
				},
				{
					body: t.Object({
						playerCount: t.Number({
							minimum: 2,
							maximum: 5,
							description: 'Number of players',
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
								error:
									'Difficulty must be either "easy", "normal", "hard", or "expert"',
							},
						),
					}),
					detail: {
						summary: 'Game Setup',
					},
				},
			)
			.group('/:gameId', (app2) =>
				app2.post('/', () => {}, {
					params: t.Object({
						gameId: t.String({
							maxLength: 8,
							description: 'Game ID (at least 8 characters)',
						}),
					}),
				}),
			),
	);

if (import.meta.main) {
	app.listen(3000);
	console.log(
		`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
	);
}

export default app;
