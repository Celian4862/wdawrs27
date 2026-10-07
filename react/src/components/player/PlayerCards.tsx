import GameInfoHeading from '@/components/game-info/GameInfoHeading';
import GameInfoSection from '@/components/game-info/GameInfoSection';
import { useGame } from '../GameContext';
import PawnCircle from './PawnCircle';

export default function PlayerCards() {
	const { state } = useGame();

	return (
		<GameInfoSection>
			<GameInfoHeading heading="Player Cards" subheading="" />
			<div className="flex flex-col gap-3">
				{state.players.map((player) => (
					<article
						key={player.role.title}
						className="rounded-xl border border-white/15 bg-white/5 p-4"
					>
						<div className="flex justify-between">
							<h2 className="text-xl font-bold text-white">
								{player.role.title}
							</h2>
							<PawnCircle color={player.role.color} />
						</div>
						<details>
							<summary className="mt-1 cursor-pointer">Abilities</summary>
							<h3 className="mt-1 text-md font-medium text-white/65">
								{player.role.ability}
							</h3>
						</details>
						<p className="my-1 text-lg font-semibold text-cyan-200 tabular-nums">
							{player.currentWaterLevel}/{player.currentWaterLevel}
						</p>
						<details>
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
													className="p-3 space-y-2 bg-black col-span-1 border rounded-lg hover:scale-110 active:bg-gray-800 motion-safe:transition-all"
													// Must add an onClick to show a modal that confirms usage of an item.
												>
													<h4 className="font-bold">{item.type}</h4>
													<p>{item.description}</p>
												</button>
											);
										})}
							</div>
						</details>
					</article>
				))}
			</div>
		</GameInfoSection>
	);
}
