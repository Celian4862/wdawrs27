import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getGameState } from "#/server/game.functions";

export const Route = createFileRoute("/$gameId")({ component: GameRoom });

function GameRoom() {
	const { gameId } = Route.useParams();

	const {
		data: gameState,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["game", gameId],
		queryFn: () => getGameState({ data: gameId }),
	});

	if (isLoading) return <div>Loading Desert...</div>;
	if (error) return <div>Game not found</div>;

	return (
		<div>
			<h1>Game Room: {gameId}</h1>
			<pre>{JSON.stringify(gameState, null, 2)}</pre>
		</div>
	);
}
