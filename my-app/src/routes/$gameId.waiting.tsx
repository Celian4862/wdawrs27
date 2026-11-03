import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getWaitingRoomInfo } from "#/server/game.functions";

export const Route = createFileRoute("/$gameId/waiting")({
	component: GameRoom,
});

function GameRoom() {
	const { gameId } = Route.useParams();
	const {
		data: waitingRoomInfo,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["game", gameId],
		queryFn: () =>
			getWaitingRoomInfo({
				data: { gameId },
			}),
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
		<div className="flex h-dvh flex-col justify-center">
			<div className="mx-auto">
				<h1 className="text-3xl font-bold">
					Game Room:{" "}
					<span className="rounded-lg bg-amber-700 p-1">{gameId}</span>
				</h1>
				<div className="mt-2 flex justify-between border-b-3 pb-1 text-xl">
					<h2>
						Player Count: {waitingRoomInfo?.users.length} /{" "}
						{waitingRoomInfo?.gameRoomInfo.playerCount}
					</h2>
					<h2>Difficulty: {waitingRoomInfo?.gameRoomInfo.difficulty}</h2>
				</div>
				<div className="mt-3 grid grid-cols-2 gap-3 text-center text-xl">
					{waitingRoomInfo?.users?.map((user) => (
						<div
							key={user.playerName}
							className="rounded-lg border bg-amber-600 p-2 text-black"
						>
							{user.playerName} <em>{user.is_admin ? "(Admin)" : ""}</em>
						</div>
					))}
				</div>
				{waitingRoomInfo?.userIsAdmin && (
					<div className="flex w-full justify-center text-2xl">
						<button
							type="button"
							className="mt-3 rounded-lg border-7 border-amber-900 bg-amber-600 p-2 text-black hover:bg-amber-500 active:bg-amber-700 motion-safe:transition"
						>
							Start Game
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
