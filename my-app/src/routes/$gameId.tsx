import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { joinGame } from "#/server/game.functions";

export const Route = createFileRoute("/$gameId")({ component: GameRoom });

function GameRoom() {
	const { gameId } = Route.useParams();

	const {
		data: gameState,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["game", gameId],
		queryFn: () => joinGame({ data: gameId }),
		retry: 1,
	});

	if (isLoading)
		return (
			<div className="flex h-dvh justify-center">
				<div className="flex flex-col justify-center text-3xl">
					Loading Desert...
				</div>
			</div>
		);
	if (error) {
		return (
			<div className="flex h-dvh justify-center">
				<div className="flex flex-col justify-center text-center text-3xl">
					{error.message}
					<br />
					<a
						href="/"
						className="mt-3 text-blue-400 underline underline-offset-5"
					>
						Return Home
					</a>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1>Game Room: {gameId}</h1>
			<pre>{JSON.stringify(gameState, null, 2)}</pre>
		</div>
	);
}
