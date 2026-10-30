import Redis from "ioredis";

export const redis = (() => {
	const redis = new Redis(
		(() => {
			const redisUrl = process.env.REDIS_URL;

			if (!redisUrl) {
				throw new Error(
					"❌ REDIS_URL or KV_URL is missing from your environment variables. Please check your Vercel integration settings.",
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

	redis.on("error", (err) => {
		console.error("❌ Redis connection error:", err);
	});

	redis.on("connect", () => {
		console.log("✅ Connected to Redis successfully");
	});
	return redis;
})();
