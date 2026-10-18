import { useGame } from '../utility/GameContext';
import PawnCircle from './PawnCircle';

export default function PlayerDetails({
	playerIndex,
	isCurrent,
}: {
	playerIndex: number;
	isCurrent: boolean;
}) {
	const { state, dispatch } = useGame();
	const player = state.players[playerIndex];

	return (
		<article className="rounded-xl border border-white/15 bg-white/5 p-4">
			<div className="flex justify-between">
				<h2 className="text-xl font-bold text-white">{player.role.title}</h2>
				<PawnCircle color={player.role.color} isCurrentPlayer={isCurrent} />
			</div>
			<details open={isCurrent}>
				<summary className="mt-1 cursor-pointer">Abilities</summary>
				<h3 className="mt-1 text-md font-medium text-white/65">
					{player.role.ability}
				</h3>
			</details>
			<p className="my-1 text-lg font-semibold text-cyan-200 tabular-nums">
				Water: {player.currentWaterLevel}/{player.role.maxWater}
			</p>
			<details open={player.items.length > 0}>
				<summary className="cursor-pointer">Items</summary>
				<div className="mt-3 text-md text-white/80 grid gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
					{player.items.length === 0
						? 'No items.'
						: player.items.map((item) => {
								if (!item) {
									throw new Error('Item is undefined');
								}
								return (
									<button
										key={`${item.type}-${item.id}`}
										type="button"
										className={`p-3 space-y-2 bg-black col-span-1 border rounded-lg hover:scale-110 active:bg-gray-800 motion-safe:transition-all `}
										onClick={() => {
											switch (item.type) {
												case 'Sand Remover':
													dispatch({
														type: 'SELECT_ACTION',
														action: item.type,
													});
													break;
											}
										}}
									>
										<h4 className="font-bold">{item.type}</h4>
										<p>{item.description}</p>
									</button>
								);
							})}
				</div>
			</details>
		</article>
	);
}
