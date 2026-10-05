import { useState } from 'react';
import DrawHurricaneCardsModal from './components/DrawHurricaneCardsModal';
import type { EndGameState } from './components/EndGameScreen';
import EndGameScreen from './components/EndGameScreen';
import GameInfoHeading from './components/GameInfoHeading';
import Setup from './components/Setup';
import { initHurricaneMeter } from './data/initHurricaneMeter';
import { shuffleHurricaneCards } from './data/shuffleHurricaneCards';
import { tiles } from './data/tiles';

export default function App() {
	// Lose state
	const [endGameState, setEndGameState] = useState<EndGameState>({});
	// Player Count - Set only at the start of the game
	const [playerCount, setPlayerCount] = useState(0);

	// Hurricane Meter Progress - To track how many cards should be drawn
	const [currentHurricaneMeterProgress, setCurrentHurricaneMeterProgress] =
		useState(-1);

	// Current Hurricane Deck - Set every time the counter (below) reaches the end
	const [currentHurricaneCards, setCurrentHurricaneCards] = useState(
		shuffleHurricaneCards(),
	);
	// Current Hurricane Deck Counter - Tracks which Hurricane Card is next to draw
	const [currentHurricaneCardCounter, setCurrentHurricaneCardCounter] =
		useState(0);
	const [discardedHurricaneCards, setDiscardedHurricaneCards] = useState<
		Record<string, number>
	>(Object.fromEntries(currentHurricaneCards.map((key) => [key, 0])));
	const totalDiscarded = Object.values(discardedHurricaneCards).reduce(
		(sum, val) => sum + val,
		0,
	);
	const [recentlyDrawn, setRecentlyDrawn] = useState('None');
	const [isDrawing, setIsDrawing] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	// Status message at Hurricane Draw button
	const [turnStatus, setTurnStatus] = useState<string | null>(null);
	/**
	 *
	 * END OF HOOKS AND HELPERS
	 *
	 */

	/**
	 *
	 * PLAYER COUNT INITIALIZATION
	 *
	 */
	// Guarantees that playerCount will not be 0 by the time it initializes other game states
	if (playerCount === 0) {
		return (
			<Setup heading="How many players?">
				{[2, 3, 4, 5].map((playerCountInput) => (
					<button
						key={playerCountInput}
						type="button"
						className="p-2 text-xl border rounded-lg"
						onClick={() => setPlayerCount(playerCountInput)}
					>
						{playerCountInput}
					</button>
				))}
			</Setup>
		);
	}

	/**
	 *
	 * Difficulty Setting
	 *
	 */
	const hurricaneMeter = initHurricaneMeter(playerCount);
	if (currentHurricaneMeterProgress < 0) {
		return (
			<Setup heading="What difficulty level?">
				{['Easy', 'Normal', 'Difficult', 'Extreme'].map(
					(difficultyInput, index) => (
						<button
							key={difficultyInput}
							type="button"
							className="p-2 text-xl border rounded-lg"
							onClick={() => {
								setCurrentHurricaneMeterProgress(index);
							}}
						>
							{difficultyInput}
						</button>
					),
				)}
			</Setup>
		);
	}

	let accumulatedTicksCount = 0;
	return (
		<div className="p-10 grid lg:grid-cols-2">
			{/**
			 *
			 * End Game Screen
			 *
			 */}
			<EndGameScreen endGameState={endGameState} />
			{/**
			 *
			 * Show Confirm Modal
			 *
			 */}
			<DrawHurricaneCardsModal
				showConfirmModal={showConfirmModal}
				cardsToDrawCount={hurricaneMeter[currentHurricaneMeterProgress]}
				onConfirm={handleDrawHurricaneCards}
				onCancel={() => setShowConfirmModal(false)}
			/>
			{/**
			 *
			 * Horizontal Scrolling Area
			 *
			 */}
			<section className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
				{/**
				 *
				 * Board
				 *
				 */}
				<div className="min-w-115 lg:fixed w-fit grid grid-cols-5 gap-5">
					{/**
					 *
					 * Tiles
					 *
					 */}
					{tiles.map((tile) => (
						<button
							key={tile.id}
							type="button"
							disabled={!tile.info}
							className={`border rounded-lg size-20 motion-safe:transition ${!tile.info ? 'brightness-50 cursor-not-allowed' : 'hover:brightness-50'}`}
						>
							{!tile.info && '🌪'}
						</button>
					))}
				</div>
			</section>
			{/**
			 *
			 * Game Info Section
			 *
			 */}
			<section className="py-5 grid gap-5">
				{/**
				 *
				 * Hurricane Meter
				 *
				 */}
				<section className="border rounded-xl p-6">
					<GameInfoHeading
						heading="Hurricane Meter"
						subheading={`${hurricaneMeter[currentHurricaneMeterProgress] === 7 ? '☠️' : hurricaneMeter[currentHurricaneMeterProgress]} / turn`}
					/>
					{/**
					 *
					 * Hurricane Meter Overflow Container
					 *
					 */}
					<div className="grid">
						<div className="overflow-x-auto">
							{/**
							 *
							 * Hurricane Meter Grid
							 *
							 */}
							<div
								className={`min-w-150 grid ${{ 2: 'grid-cols-14', 3: 'grid-cols-15', 4: 'grid-cols-15', 5: 'grid-cols-16' }[playerCount]} md:min-w-0`}
							>
								{/**
								 *
								 * Hurricane Meter Loop
								 *
								 */}
								{Array.from(new Set(hurricaneMeter)).map(
									(hurricaneMeterTier) => {
										const span =
											{
												2: 1,
												3: { 2: 3, 3: 4, 4: 4, 5: 5 }[playerCount],
												4: 4,
												5: 3,
												6: 2,
												7: 1,
											}[hurricaneMeterTier] ?? 0;
										const edgeRoundingStyle =
											{ 2: 'rounded-l-xl', 7: 'rounded-r-xl' }[
												hurricaneMeterTier
											] || '';
										const startIndex = accumulatedTicksCount;
										accumulatedTicksCount += span;
										return (
											/**
											 *
											 * Hurricane Meter Tier
											 *
											 */
											<div
												key={hurricaneMeterTier}
												className={`h-12 relative py-2 flex justify-center text-2xl border ${edgeRoundingStyle}`}
												style={{ gridColumn: `span ${span} / span ${span}` }}
											>
												{/**
												 *
												 * Hurricane Meter Tick
												 *
												 */}
												<div className={`absolute inset-0 grid grid-flow-col`}>
													{Array.from({ length: span }).map((_, tickIndex) => {
														const globalIndex = startIndex + tickIndex;
														const isFilled =
															globalIndex <= currentHurricaneMeterProgress;
														const fillColor = isFilled
															? {
																	2: 'bg-amber-400/90',
																	3: 'bg-amber-500/90',
																	4: 'bg-amber-600/90',
																	5: 'bg-amber-700/90',
																	6: 'bg-amber-800/90',
																	7: 'bg-red-600/90',
																}[hurricaneMeterTier]
															: 'bg-transparent';
														return (
															<div
																// biome-ignore lint/suspicious/noArrayIndexKey: Static array that never reorders or mutates
																key={tickIndex}
																className={`${edgeRoundingStyle} ${fillColor}`}
															/>
														);
													})}
												</div>
												<span className="relative z-10 font-bold">
													{hurricaneMeterTier === 7 ? '☠️' : hurricaneMeterTier}
												</span>
											</div>
										);
									},
								)}
							</div>
						</div>
					</div>
				</section>
				{/**
				 *
				 * Hurricane Deck
				 *
				 */}
				<section className="border rounded-xl p-6">
					<GameInfoHeading
						heading="Hurricane Deck"
						subheading={`${totalDiscarded} / 31`}
					/>
					{/**
					 *
					 * Overflow Container
					 *
					 */}
					<div className="grid">
						<div className="overflow-x-auto">
							{/**
							 *
							 * Actual Grid
							 *
							 */}
							<div className="min-w-110 grid grid-cols-2 gap-3 *:py-1 *:text-lg *:border *:rounded-lg">
								<div
									className={`${recentlyDrawn === 'Thirst' ? 'bg-blue-700' : 'bg-none'} flex justify-around items-center`}
								>
									<h3 className="font-bold">Thirst</h3>
									<span>{discardedHurricaneCards.Thirst} / 4</span>
								</div>
								<div
									className={`${recentlyDrawn === 'Hurricane Up' ? 'bg-red-700/80' : 'bg-none'} flex justify-around items-center`}
								>
									<h3 className="font-bold">Hurricane Up</h3>
									<span>{discardedHurricaneCards['Hurricane Up']} / 3</span>
								</div>
								{/**
								 *
								 * Movement Cards Table
								 *
								 */}
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
																	recentlyDrawn ===
																	`Move ${distance} ${direction}`
																		? 'bg-amber-500'
																		: 'bg-none'
																}
															>
																{
																	discardedHurricaneCards[
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
						{turnStatus && (
							<p className="text-center text-amber-400 font-semibold animate-pulse">
								{turnStatus}
							</p>
						)}
						<button
							type="button"
							disabled={isDrawing}
							className={`p-3 bg-red-600/70 w-full rounded-lg font-semibold transition ${isDrawing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
							onClick={() => setShowConfirmModal(true)}
						>
							{isDrawing
								? 'Drawing Cards...'
								: 'Draw Cards (Warning: Ends your Turn)'}
						</button>
					</div>
				</section>
				{/**
				 *
				 * Item Deck
				 *
				 */}
				<section className="border rounded-xl p-6">
					<GameInfoHeading heading="Item Deck" subheading="" />
				</section>
				<section className="border rounded-xl p-6">
					<GameInfoHeading heading="Player Cards" subheading="" />
				</section>
			</section>
		</div>
	);

	async function handleDrawHurricaneCards() {
		setShowConfirmModal(false);
		setIsDrawing(true);
		setTurnStatus('Drawing cards...');

		const delay = (ms: number) =>
			new Promise((resolve) => setTimeout(resolve, ms));

		try {
			const drawCount = hurricaneMeter[currentHurricaneMeterProgress];

			let activeIndex = currentHurricaneCardCounter;
			let deck = currentHurricaneCards;
			let localHurricaneMeterProgress = currentHurricaneMeterProgress;

			for (let i = 0; i < drawCount; i++) {
				await delay(1000); // 1-second interval between card reveals

				if (activeIndex >= 31) {
					deck = shuffleHurricaneCards();
					activeIndex = 0;
					setCurrentHurricaneCards(deck);
					setDiscardedHurricaneCards(
						Object.fromEntries(deck.map((card) => [card, 0])),
					);
				}

				const drawnCard = deck[activeIndex];

				if (drawnCard === 'Hurricane Up') {
					localHurricaneMeterProgress += 1;
					setCurrentHurricaneMeterProgress(localHurricaneMeterProgress);
				}

				setRecentlyDrawn(drawnCard);
				setDiscardedHurricaneCards((prevDiscarded) => ({
					...prevDiscarded,
					[drawnCard]: (prevDiscarded[drawnCard] ?? 0) + 1,
				}));

				activeIndex += 1;
				// Advance counter and evaluate deck reset cleanly
				setCurrentHurricaneCardCounter(activeIndex);

				// CHECK LOSE CONDITIONS
				if (localHurricaneMeterProgress === hurricaneMeter.length - 1) {
					// Must run before setting the end game state or else
					// the End Game PopUp component will render during the
					// delay.
					await delay(1500);

					setEndGameState({
						status: 'You Lose',
						reason: 'The Hurricane Meter reached its limit',
					});
					return;
				}
			}

			// End of turn rest delay & notification phase
			setTurnStatus('Turn complete! Passing to next player...');
			await delay(1500); // Guard delay to display message before unlocking UI
		} finally {
			setIsDrawing(false);
			setTurnStatus(null);
		}
	}
}
