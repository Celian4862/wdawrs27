import { Elysia, t } from 'elysia';
import { customAlphabet } from 'nanoid';
import { db } from './db';
import { gamesTable } from './schema';

const generateGameId = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	8,
);

const app = new Elysia()
	.get('/', () => ({
		name: 'Game Backend API',
		status: 'online',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
		endpoints: {
			createGame: 'POST /game/setup',
			getGame: 'GET /games/:id',
			performAction: 'POST /games/:id/actions',
		},
	}))
	.group('/game', (app) =>
		app.post(
			'/setup',
			async ({ body, set }) => {
				const gameId = generateGameId();
				const gameSession = await db.insert(gamesTable).values({
					id: gameId,
					status: 'waiting',
					stateJSON: {},
				});
				set.status = 201;
				return gameSession;
			},
			{
				body: t.Object({
					playerCount: t.Number({
						minimum: 2,
						maximum: 5,
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
			},
		),
	);

if (import.meta.main) {
	app.listen(3000);
	console.log(
		`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
	);
}

export default app;
