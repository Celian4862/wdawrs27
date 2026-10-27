import Redis from 'ioredis';
import { customAlphabet } from 'nanoid';

export function shuffle<T>(items: readonly T[]): T[] {
	const result = [...items];

	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result;
}

export function generateGameId() {
	return customAlphabet(
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
		8,
	)();
}

export const redis = (() => {
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
		{
			keepAlive: 30000,
			retryStrategy(times) {
				const delay = Math.min(times * 50, 2000);
				return delay;
			},
		},
	);

	redis.on('error', (err) => {
		console.error('❌ Redis connection error:', err);
	});

	redis.on('connect', () => {
		console.log('✅ Connected to Redis successfully');
	});
	return redis;
})();
