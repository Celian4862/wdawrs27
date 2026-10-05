import { useGame } from '@/components/GameContext';
import GameInfoHeading from '@/components/GameInfoHeading';

export default function HurricaneDeckSection() {
	const { state, dispatch } = useGame();
	const totalDiscarded = Object.values(state.discardedHurricaneDeck).reduce(
		(sum, val) => sum + val,
		0,
	);

	return (
		<section className="border rounded-xl p-6">
			<GameInfoHeading
				heading="Hurricane Deck"
				subheading={`${totalDiscarded} / 31`}
			/>
			<div className="grid">
				<div className="overflow-x-auto">
					<div className="min-w-110 grid grid-cols-2 gap-3 *:py-1 *:text-lg *:border *:rounded-lg">
						<div
							className={`${state.recentlyDrawnHurricaneCard === 'Thirst' ? 'bg-blue-700' : 'bg-none'} flex justify-around items-center`}
						>
							<h3 className="font-bold">Thirst</h3>
							<span>{state.discardedHurricaneDeck.Thirst} / 4</span>
						</div>
						<div
							className={`${state.recentlyDrawnHurricaneCard === 'Hurricane Up' ? 'bg-red-700/80' : 'bg-none'} flex justify-around items-center`}
						>
							<h3 className="font-bold">Hurricane Up</h3>
							<span>{state.discardedHurricaneDeck['Hurricane Up']} / 3</span>
						</div>

						<table className="border-separate border-spacing-2 text-center col-span-2 table-fixed">
							<thead>
								<tr>
									<th>Direction</th>
									<th>1</th>
									<th>2</th>
									<th>3</th>
								</tr>
							</thead>
							<tbody>
								{['Up', 'Down', 'Left', 'Right'].map((direction) => {
									return (
										<tr key={direction}>
											<td>{direction}</td>
											{[1, 2, 3].map((distance) => {
												return (
													<td
														key={`Move ${distance} ${direction}`}
														className={
															state.recentlyDrawnHurricaneCard ===
															`Move ${distance} ${direction}`
																? 'bg-amber-500'
																: 'bg-none'
														}
													>
														{
															state.discardedHurricaneDeck[
																`Move ${distance} ${direction}`
															]
														}{' '}
														/ {4 - distance}
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
			</div>

			<div className="mt-4 flex flex-col gap-2 justify-center items-center">
				{state.turnStatus && (
					<p className="text-center text-amber-400 font-semibold animate-pulse">
						{state.turnStatus}
					</p>
				)}
				<button
					type="button"
					disabled={state.isDrawingHurricaneCards}
					className={`p-3 bg-red-600/70 w-full rounded-lg font-semibold transition ${state.isDrawingHurricaneCards ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
					onClick={() =>
						dispatch({ type: 'SET_SHOW_CONFIRM_MODAL', show: true })
					}
				>
					{state.isDrawingHurricaneCards
						? 'Drawing Cards...'
						: 'Draw Cards (Warning: Ends your Turn)'}
				</button>
			</div>
		</section>
	);
}
