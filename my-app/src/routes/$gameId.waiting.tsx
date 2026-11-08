import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import DeleteGameModal from "#/components/DeleteGameModal";
import { getWaitingRoomInfo, startGame } from "#/server/game.functions";

export const Route = createFileRoute("/$gameId/waiting")({
	component: GameRoom,
});

function GameRoom() {
	const { gameId } = Route.useParams();
	const navigate = useNavigate();
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
		refetchInterval: 2000,
	});

	useEffect(() => {
		if (error) {
			navigate({ to: "/" });
		} else if (waitingRoomInfo?.gameRoomInfo.status === "started") {
			navigate({ to: "/$gameId/started", params: { gameId } });
		}
	}, [error, gameId, waitingRoomInfo?.gameRoomInfo.status, navigate]);

	if (isLoading)
		return (
			<div className="flex h-dvh justify-center">
				<div className="flex flex-col justify-center text-3xl">
					Loading Desert...
				</div>
			</div>
		);
	if (error) {
		return;
	}

	return (
		<div className="flex h-dvh flex-col justify-center">
			<div className="mx-auto">
				<h1 className="text-3xl font-bold">
					Game Room:{" "}
					<span className="rounded-lg bg-amber-700 p-1">{gameId}</span>
				</h1>
				<div className="mt-2 flex justify-between text-xl">
					<h2>
						Player Count: {waitingRoomInfo?.users.length} /{" "}
						{waitingRoomInfo?.gameRoomInfo.playerCount}
					</h2>
					<span>|</span>
					<h2>Difficulty: {waitingRoomInfo?.gameRoomInfo.difficulty}</h2>
				</div>

				<hr className="my-3 border-2" />

				<div className="grid grid-cols-2 gap-3 text-center text-xl">
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
					<>
						<button
							type="button"
							disabled={
								waitingRoomInfo?.users.length <
								waitingRoomInfo?.gameRoomInfo.playerCount
							}
							onClick={async () => {
								try {
									await startGame({ data: { gameId } });
									navigate({ to: "/$gameId/started", params: { gameId } });
								} catch (err) {
									console.error(err);
								}
							}}
							className={`mt-3 w-full rounded-lg border-5 border-amber-600 bg-amber-900 p-2 text-2xl ${waitingRoomInfo?.users.length < waitingRoomInfo?.gameRoomInfo.playerCount ? "brightness-50" : "hover:brightness-130 active:brightness-85"} motion-safe:transition`}
						>
							Start Game
						</button>

						<hr className="my-4 border-2" />

						<DeleteGameModal gameId={gameId} />
					</>
				)}
			</div>
		</div>
	);
}
