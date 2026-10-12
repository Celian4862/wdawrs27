import { useGame } from '@/components/GameContext';
import GameInfoHeading from '@/components/game-info/GameInfoHeading';
import GameInfoSection from '@/components/game-info/GameInfoSection';
import {
	countHurricaneCards,
	hurricaneDirections,
	hurricaneDistances,
} from '@/data/hurricane/hurricaneDeck';
import { sumSandPoints } from '@/data/tiles';

export default function HurricaneDeck() {
	const { state } = useGame();
	const hurricaneCount = countHurricaneCards(state.hurricaneDeck);

	return (
		<GameInfoSection>
			<GameInfoHeading
				heading="Hurricane Deck"
				subheading={`${state.hurricaneDeck.length}`}
			/>
			<div className="grid md:grid-cols-2 gap-3 *:py-1 *:text-lg *:border *:rounded-lg">
				<div
					className={`${state.recentlyDrawnHurricaneCard.type === 'Thirst' ? 'bg-blue-700' : 'bg-none'} flex justify-around items-center`}
				>
					<h3 className="font-bold">Thirst</h3>
					<span>{hurricaneCount.Thirst ?? 0}</span>
				</div>
				<div
					className={`${state.recentlyDrawnHurricaneCard.type === 'Hurricane Up' ? 'bg-red-700/80' : 'bg-none'} flex flex-wrap justify-around items-center`}
				>
					<h3 className="font-bold">Hurricane Up</h3>
					<span>{hurricaneCount['Hurricane Up'] ?? 0}</span>
				</div>

				<div className="grid md:col-span-2">
					<div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
						<table className="min-w-70 w-full border-separate border-spacing-2 text-center table-fixed">
							<thead>
								<tr>
									<th>Move</th>
									<th>1</th>
									<th>2</th>
									<th>3</th>
								</tr>
							</thead>
							<tbody>
								{hurricaneDirections.map((direction) => {
									return (
										<tr key={direction}>
											<td>{direction}</td>

											{hurricaneDistances.map((distance) => {
												const moveString = `Move ${distance} ${direction}`;

												return (
													<td
														key={moveString}
														className={
															state.recentlyDrawnHurricaneCard.distance ===
																distance &&
															state.recentlyDrawnHurricaneCard.direction ===
																direction
																? 'bg-amber-500'
																: 'bg-black'
														}
													>
														{hurricaneCount[moveString] ?? 0}
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
				<div className="flex flex-wrap justify-around items-center md:col-span-2">
					<h3 className="font-bold">Sand Point Count: </h3>
					{48 - sumSandPoints(state.board)} / 48
				</div>
			</div>
		</GameInfoSection>
	);
}
