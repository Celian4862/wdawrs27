import type { SetGameAction, UserInfo } from "#/server/game/types";
import { getItemDescription, getItemName } from "#/server/item/helpers";
import type { ItemKey } from "#/server/item/types";
import {
	getCurrentPlayer,
	getMaxWater,
	getRoleAbility,
	getRoleTitle,
	sumPlayerInventory,
} from "#/server/player/helpers";
import type { ActivePlayer, PlayerState } from "#/server/player/types";
import PawnCircle from "./PawnCircle";

export default function PlayerCards({
	turnCount,
	players,
	playerNames,
	setSelectedAction,
}: {
	turnCount: number;
	players: PlayerState;
	playerNames: UserInfo;
	setSelectedAction: SetGameAction;
}) {
	const currentPlayer = getCurrentPlayer(players);

	return (
		<section className="rounded-xl border p-6">
			<div className="flex flex-wrap items-center justify-between pb-6">
				<h1 className="text-2xl">Player Cards</h1>
				<h2 className="text-xl">Turn {turnCount}</h2>
			</div>
			<div className="flex flex-col gap-3">
				<h3 className="text-lg">Current player:</h3>
				<PlayerDetails
					player={currentPlayer}
					playerName={
						playerNames[currentPlayer.roleKey]?.isYou
							? "You"
							: (playerNames[currentPlayer.roleKey]?.playerName ?? "")
					}
					isCurrent={true}
					setSelectedAction={setSelectedAction}
				/>
				<details>
					<summary className="mb-3 cursor-pointer">Other players</summary>
					<div className="flex flex-col gap-3">
						{players.map((player, idx) => {
							if (idx > 0) {
								return (
									<PlayerDetails
										key={player.roleKey}
										player={players[idx]}
										playerName={
											playerNames[players[idx].roleKey]?.isYou
												? "You"
												: (playerNames[players[idx].roleKey]?.playerName ?? "")
										}
										isCurrent={false}
										setSelectedAction={setSelectedAction}
									/>
								);
							}
							return null;
						})}
					</div>
				</details>
			</div>
		</section>
	);
}

function PlayerDetails({
	player,
	playerName,
	isCurrent,
	setSelectedAction,
}: {
	player: ActivePlayer;
	playerName: string;
	isCurrent: boolean;
	setSelectedAction: SetGameAction;
}) {
	const itemCount = sumPlayerInventory(player.inventory);

	return (
		<article className="rounded-xl border border-white/15 bg-white/5 p-4">
			<div className="flex justify-between">
				<h2 className="text-xl font-bold text-white">
					{getRoleTitle(player.roleKey)} (
					{playerName === "You" ? <em>You</em> : playerName})
				</h2>
				<PawnCircle roleKey={player.roleKey} isCurrentPlayer={isCurrent} />
			</div>
			<details open={isCurrent}>
				<summary className="mt-1 cursor-pointer">Abilities</summary>
				<h3 className="text-md mt-1 font-medium text-white/65">
					{getRoleAbility(player.roleKey)}
				</h3>
			</details>
			<p className="my-1 text-lg font-semibold text-cyan-200 tabular-nums">
				Water: {player.currentWater}/{getMaxWater(player.roleKey)}
			</p>
			<details open={itemCount > 0 && isCurrent}>
				<summary className="cursor-pointer">Items</summary>
				<div className="text-md mt-3 grid gap-3 text-white/80 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
					{itemCount === 0
						? "No items."
						: (Object.keys(player.inventory) as ItemKey[])
								.filter((itemKey) => player.inventory[itemKey] > 0)
								.map((item) => {
									if (!item) {
										throw new Error("Item is undefined");
									}
									return (
										<button
											key={`${item}`}
											type="button"
											className={`col-span-1 space-y-2 rounded-lg border bg-black p-3 hover:scale-110 active:bg-gray-800 motion-safe:transition-all`}
											onClick={() => {
												setSelectedAction(item);
											}}
										>
											<h4 className="text-center font-bold">
												{getItemName(item)} [{player.inventory[item]}]
											</h4>
											<p className="text-justify">{getItemDescription(item)}</p>
										</button>
									);
								})}
				</div>
			</details>
		</article>
	);
}
