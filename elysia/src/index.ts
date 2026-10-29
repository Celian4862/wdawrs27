import { openapi } from '@elysia/openapi';
import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { enableMapSet } from 'immer';
import { gameRoutes } from './features/game/routes';
import { appVersion } from './features/shared/data';
import { redis } from './features/shared/helpers';

// Enable support for Set and Map mutations inside Immer produce blocks
enableMapSet();

const app = new Elysia()
	.use(
		cors({
			origin: process.env.FRONTEND_URL || 'http://localhost:5173',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
		}),
	)
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
	.use(gameRoutes);

if (import.meta.main) {
	app.listen(3000);
	console.log(
		`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
	);
}

export default app;
