import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getGameState } from "#/server/game.functions";

export const Route = createFileRoute("/$gameId")({ component: GameRoom });

function GameRoom() {
	const { gameId } = Route.useParams();
	const { isLoading, error } = useQuery({
		queryKey: ["game", gameId],
		queryFn: () => getGameState({ data: gameId }),
		retry: 1,
		refetchInterval: 3000,
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
		<div className="flex h-dvh justify-center">
			<div className="flex flex-col justify-center">
				<h1 className="text-3xl font-bold">Game Room: {gameId}</h1>
				<div className="grid grid-cols-2">{}</div>
			</div>
		</div>
	);
}
