import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Board from "#/components/Board";
import DeleteGameModal from "#/components/DeleteGameModal";
import Legend from "#/components/Legend";
import Parts from "#/components/Parts";
import { getGameState } from "#/server/game.functions";

export const Route = createFileRoute("/$gameId/started")({
	component: RouteComponent,
});

function RouteComponent() {
	const { gameId } = Route.useParams();
	const navigate = useNavigate();
	const {
		data: gameState,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["game", gameId],
		queryFn: () =>
			getGameState({
				data: { gameId },
			}),
		retry: 1,
		refetchInterval: 2000,
		initialData: {
			isAdmin: false,
			board: [],
			players: [],
			hurricaneMeter: {
				meter: [],
				progress: 0,
			},
			partsCollected: [],
		},
		select: (data) => ({
			...data,
			board: data?.board ?? [],
			players: data?.players ?? [],
			partsCollected: data?.partsCollected ?? [],
		}),
	});

	useEffect(() => {
		if (error) {
			navigate({ to: "/" });
		}
	}, [error, navigate]);

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
		<div className="box-border grid w-screen grid-cols-1 gap-6 p-10 lg:h-dvh lg:grid-cols-11 lg:gap-10 lg:pb-0 xl:grid-cols-2">
			<div className="flex h-full flex-col gap-4 lg:col-span-5 lg:min-h-0 lg:overflow-hidden lg:pb-10 xl:col-span-1">
				{/* <HurricaneMeter hurricaneMeter={state.hurricaneMeter} /> */}
				<div className="flex min-h-0 flex-1 items-center justify-center">
					<Board
						board={gameState.board}
						selectedAction=""
						players={gameState.players}
					/>
				</div>
			</div>

			<div className="h-full min-h-0 lg:col-span-6 lg:flex lg:flex-col xl:col-span-1">
				<div className="pr-2 lg:h-full lg:overflow-y-auto">
					<section className="flex flex-col-reverse gap-5 py-5 lg:flex-col">
						{/* <ActionPanel /> */}
						<div className="flex flex-col gap-5">
							{/* <PlayerCards /> */}
							{/* <HurricaneDeck /> */}
							{/* <ItemDeck /> */}
							<Parts partsCollected={gameState.partsCollected} />
							<Legend />
							{gameState.isAdmin && <DeleteGameModal gameId={gameId} />}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
