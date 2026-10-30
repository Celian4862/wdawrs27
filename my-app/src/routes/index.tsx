import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { setupGame } from "#/server/game.functions";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const navigate = useNavigate();

	const handleCreate = async () => {
		const newGame = await setupGame({
			data: { playerCount: 4, difficulty: "normal" },
		});

		// Navigate to the dynamic route
		navigate({ to: "/$gameId", params: { gameId: newGame.id } });
	};

	return (
		<button type="button" onClick={handleCreate}>
			Create Game
		</button>
	);
}
