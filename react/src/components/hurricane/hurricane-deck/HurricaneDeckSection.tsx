import { useGame } from '@/components/GameContext';
import GameInfoHeading from '@/components/game-info/GameInfoHeading';
import {
	hurricaneDirections,
	hurricaneDistances,
} from '@/data/shuffleHurricaneDeck';
import { sumSandPoints } from '@/data/tiles';

export default function HurricaneDeckSection() {
	const { state, dispatch } = useGame();

	return (
		<section className="border rounded-xl p-6 relative">
			<GameInfoHeading
				heading="Hurricane Deck"
				subheading={`${state.hurricaneDeckCounter} / 31`}
			/>
			<div className="grid md:grid-cols-2 gap-3 *:py-1 *:text-lg *:border *:rounded-lg">
				<div
					className={`${state.recentlyDrawnHurricaneCard.type === 'Thirst' ? 'bg-blue-700' : 'bg-none'} flex justify-around items-center`}
				>
					<h3 className="font-bold">Thirst</h3>
					<span>{state.discardedHurricaneDeck.Thirst} / 4</span>
				</div>
				<div
					className={`${state.recentlyDrawnHurricaneCard.type === 'Hurricane Up' ? 'bg-red-700/80' : 'bg-none'} flex justify-around items-center`}
				>
					<h3 className="font-bold">Hurricane Up</h3>
					<span>{state.discardedHurricaneDeck['Hurricane Up']} / 3</span>
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
														{state.discardedHurricaneDeck[moveString]} /{' '}
														{4 - distance}
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
				<div className="flex justify-around items-center md:col-span-2">
					<h3 className="font-bold">Sand Mark Count: </h3>
					{sumSandPoints(state.board)} / 48
				</div>
			</div>

			{/* VIEWPORT-FIXED DOCK (Floats over the entire app) */}
			<div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-1.5rem)] max-w-2xl p-3 flex flex-col gap-2 justify-center items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl lg:relative lg:bottom-auto lg:left-auto lg:translate-x-0 lg:mt-4 lg:p-0 lg:bg-transparent lg:border-0 lg:w-full lg:shadow-none">
				{/* Always-visible drawn card indicator */}
				{state.recentlyDrawnHurricaneCard && (
					<div className="w-full text-center py-1 px-3 bg-slate-800/80 rounded-lg border border-slate-700 text-sm flex justify-between items-center lg:hidden">
						<span className="text-slate-400 font-medium">Last Card:</span>
						<span className="font-bold text-amber-400">
							{state.recentlyDrawnHurricaneCard.type !== 'Move'
								? state.recentlyDrawnHurricaneCard.type
								: `Move ${state.recentlyDrawnHurricaneCard.distance} ${state.recentlyDrawnHurricaneCard.direction}`}
						</span>
					</div>
				)}

				{state.turnStatus && (
					<p className="text-center text-amber-400 font-semibold animate-pulse text-sm md:text-base">
						{state.turnStatus}
					</p>
				)}

				<button
					type="button"
					disabled={
						state.isDrawingHurricaneCards || state.showConfirmEndTurnModal
					}
					className={`p-3 bg-red-600/70 w-full rounded-lg font-semibold motion-safe:transition ${
						state.isDrawingHurricaneCards || state.showConfirmEndTurnModal
							? 'brightness-50 cursor-not-allowed'
							: 'hover:bg-red-600 active:brightness-50'
					}`}
					onClick={() =>
						dispatch({ type: 'SET_SHOW_CONFIRM_END_TURN_MODAL', show: true })
					}
				>
					Draw Cards (Warning: Ends your Turn)
				</button>
			</div>
		</section>
	);
}
