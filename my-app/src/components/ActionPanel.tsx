import {
	findNeighboring,
	findSandPoints,
	getCurrentTileIndex,
} from "#/server/board/helpers";
import type { Board } from "#/server/board/types";
import type {
	GameAction,
	HurricaneDrawStatus,
	SetGameAction,
} from "#/server/game/types";
import type { HurricaneCard } from "#/server/hurricane/types";
import {
	findPlayer,
	getCurrentPlayer,
	getRoleTitle,
} from "#/server/player/helpers";
import type { PlayerState } from "#/server/player/types";
import EndTurnModal from "./EndTurnModal";
import RevealTileModal from "./RevealTileModal";

interface ActionType {
	name: GameAction;
	disableCondition: boolean;
}

export default function ActionPanel({
	actionCount,
	board,
	players,
	selectedAction,
	setSelectedAction,
	drawnHurricaneCard,
	hurricaneDrawStatus,
}: {
	actionCount: number;
	board: Board;
	players: PlayerState;
	selectedAction: GameAction;
	setSelectedAction: SetGameAction;
	drawnHurricaneCard: HurricaneCard;
	hurricaneDrawStatus: HurricaneDrawStatus;
}) {
	const currentPlayer = getCurrentPlayer(players);
	const hikerPlayer = findPlayer(players, "hiker");

	const currentTileIndex = getCurrentTileIndex(board, currentPlayer);

	if (board[currentTileIndex].id === 12) {
		throw new Error("Current tile is invalid");
	}

	const actions: ActionType[] = [
		{
			name: "Move",
			disableCondition:
				board[currentTileIndex].sandPoints > 1 &&
				hikerPlayer?.tileId !== currentPlayer.tileId,
		},
		{
			name: "Remove Sand",
			disableCondition:
				findSandPoints(
					board,
					currentTileIndex,
					findNeighboring(board, currentPlayer),
				).length === 0,
		},
		{
			name: "Collect Part",
			disableCondition:
				board[currentTileIndex].parts.length === 0 ||
				!board[currentTileIndex].revealed,
		},
		{
			name: "Reveal Tile",
			disableCondition:
				board[currentTileIndex].sandPoints > 0 ||
				(board[currentTileIndex].revealed ?? false),
		},
	];

	let roleActions: ActionType[] | null = null;
	switch (currentPlayer.roleKey) {
		case "hiker":
			roleActions = players.flatMap((player) => {
				if (player.roleKey === currentPlayer.roleKey) return [];

				return {
					name: `Pick Up ${getRoleTitle(player.roleKey)}`,
					disableCondition: currentPlayer.tileId !== player.tileId,
				};
			});
			break;
	}

	const disabled = (action: (typeof actions)[number]) =>
		action.disableCondition ||
		// || state.isDrawingHurricaneCards
		actionCount === 0;

	return (
		<section className="sticky bottom-0 z-20 flex w-full flex-col items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/90 p-6 backdrop-blur-md lg:top-0 lg:block lg:flex">
			<div className="flex w-full flex-wrap items-center justify-between">
				<h1 className="text-2xl">Action Panel</h1>
				<h2 className="text-xl">{`${actionCount} actions left`}</h2>
			</div>

			{drawnHurricaneCard && (
				<div className="mt-3 flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1 text-center text-sm lg:hidden">
					<span className="font-medium text-slate-400">Last Card:</span>
					<span className="font-bold text-amber-400">
						{drawnHurricaneCard.type !== "Move"
							? drawnHurricaneCard.type
							: `Move ${drawnHurricaneCard.distance} ${drawnHurricaneCard.direction}`}
					</span>
				</div>
			)}

			<div className="flex w-full flex-col lg:flex-col-reverse">
				{hurricaneDrawStatus && (
					<p className="mt-3 animate-pulse text-center text-sm font-semibold text-amber-400 md:text-base">
						{hurricaneDrawStatus}
					</p>
				)}
				<div className="relative">
					<details open className="mt-3">
						<summary className="mb-3 cursor-pointer">Main Actions</summary>
						<div className="mt-3 flex flex-wrap justify-start gap-2 lg:m-0">
							{actions.map((action) => (
								<div key={action.name} className="relative inline-block">
									{action.name === "Collect Part" &&
										!action.disableCondition && <PingCircle />}
									{action.name === "Reveal Tile" ? (
										<RevealTileModal
											hurricaneDrawStatus={hurricaneDrawStatus}
										/>
									) : (
										<button
											type="button"
											disabled={disabled(action)}
											onClick={() => {
												if (
													// state.isDrawingHurricaneCards ||
													action.disableCondition
												) {
													return;
												}
												if (action.name === "Collect Part") {
													// const board = [...board];
													// const partsCollected = [...state.partsCollected];
													// const tileInfo = board[currentTileIndex].info;
													// if (tileInfo) {
													// 	const partToCollect = tileInfo.parts.pop();
													// 	board[currentTileIndex] = {
													// 		...board[currentTileIndex],
													// 		info: {
													// 			...tileInfo,
													// 		},
													// 	};
													// 	if (partToCollect) {
													// 		partsCollected.push(partToCollect);
													// 	}
													// }
													// dispatch({
													// 	type: "COLLECT_PART",
													// 	board,
													// 	partsCollected,
													// });
												}
												setSelectedAction(
													selectedAction === action.name ? null : action.name,
												);
											}}
											className={`rounded-lg border p-3 motion-safe:transition ${disabled(action) ? "brightness-50" : "hover:bg-yellow-600"} ${action.name !== "Collect Part" && selectedAction === action.name ? "scale-115 bg-yellow-600" : ""}`}
										>
											{action.name}
										</button>
									)}
								</div>
							))}
							<div className="relative inline-block">
								{actionCount === 0 && !hurricaneDrawStatus && <PingCircle />}
								<EndTurnModal hurricaneDrawStatus={hurricaneDrawStatus} />
							</div>
						</div>
					</details>
					<details className="mt-3">
						<summary className="mb-3 cursor-pointer">Role Actions</summary>
						<div className="mt-3 flex flex-wrap justify-start gap-2 lg:m-0">
							{roleActions
								? roleActions.map((action) => (
										<div key={action.name} className="relative inline-block">
											<button
												type="button"
												disabled={disabled(action)}
												onClick={() => {
													// if (
													// 	state.isDrawingHurricaneCards ||
													// 	action.disableCondition
													// ) {
													// 	return;
													// }
													// dispatch({
													// 	type: "SELECT_ACTION",
													// 	action:
													// 		selectedAction === action.name
													// 			? null
													// 			: action.name,
													// });
												}}
												className={`rounded-lg border p-3 motion-safe:transition ${disabled(action) ? "brightness-50" : "hover:bg-yellow-600"} ${selectedAction === action.name ? "scale-115 bg-yellow-600" : ""}`}
											>
												{action.name}
											</button>
										</div>
									))
								: undefined}
						</div>
					</details>
				</div>
			</div>
		</section>
	);
}

function PingCircle() {
	return (
		<span className="absolute -top-1 -right-1 flex h-3 w-3">
			<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
			<span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
		</span>
	);
}
