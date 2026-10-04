import { useState } from 'react';

export default function App() {
	// Lose state
	const [endGameState, setEndGameState] = useState<{
		status?: string;
		reason?: string;
	}>({});
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
	 * END HOOKS AND HELPERS
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
			<div className="h-screen flex justify-center">
				<div className="flex flex-col justify-center">
					<div className="md:w-100 text-center">
						<h1 className="text-2xl pb-6">How many players?</h1>
						<div className="grid grid-cols-2 gap-3">
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
						</div>
					</div>
				</div>
			</div>
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
			<div className="h-screen flex justify-center">
				<div className="flex flex-col justify-center">
					<div className="md:w-100 text-center">
						<h1 className="text-2xl pb-6">What difficulty level?</h1>
						<div className="grid grid-cols-2 gap-3">
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
						</div>
					</div>
				</div>
			</div>
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
			<PopUp
				className={
					!!endGameState.status
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none'
				}
			>
				<h3 className="text-2xl font-bold">{endGameState.status}</h3>
				<p className="text-slate-300">{endGameState.reason}</p>
			</PopUp>
			{/**
			 * 
			 * Show Confirm Modal
			 * 
			 */}
			<PopUp
				className={
					showConfirmModal
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none'
				}
			>
				<h3 className="text-2xl font-bold">End Your Turn?</h3>
				<p className="text-slate-300">
					This will automatically draw{' '}
					<strong className="text-amber-400">
						{hurricaneMeter[currentHurricaneMeterProgress]}
					</strong>{' '}
					Hurricane cards and advance to the next player.
				</p>
				<div className="pt-2 flex flex-col gap-3 justify-center md:flex-row">
					<button
						type="button"
						className="px-5 py-2 bg-red-600 hover:bg-red-700 font-bold rounded-lg transition"
						onClick={async () => {
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
						}}
					>
						Confirm & Draw
					</button>
					<button
						type="button"
						className="px-5 py-2 border rounded-lg hover:bg-slate-800 transition"
						onClick={() => setShowConfirmModal(false)}
					>
						Cancel
					</button>
				</div>
			</PopUp>
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
}

function PopUp(props: { className?: string; children: React.ReactNode }) {
	return (
		<div
			className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 motion-safe:transition-all motion-safe:ease-in-out ${props.className}`}
		>
			<div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
				{props.children}
			</div>
		</div>
	);
}

function GameInfoHeading(props: { heading: string; subheading: string }) {
	return (
		<div className="flex flex-col md:flex-row md:items-center md:justify-between">
			<h1 className="text-2xl md:pb-6">{props.heading}</h1>
			<h2 className="pb-6 text-xl">{props.subheading}</h2>
		</div>
	);
}

const tiles = (() => {
	const tiles: {
		id: number;
		info?: {
			sandMarks: number;
			revealed: boolean;
			unrevealedType: string;
			revealedType: string;
			hintVariant?: string;
		};
	}[] = Array(25);

	// HURRICANE TILE
	tiles[12] = {
		id: 12,
	};

	// STARTING TILE
	tiles[19] = {
		id: 19,
		info: {
			sandMarks: 0,
			revealed: false,
			unrevealedType: 'Start',
			revealedType: 'Item',
		},
	};

	// GREENTH TILES
	const greenthTiles = shuffle(['Water', 'Water', 'Fake']);
	[3, 5, 21].forEach((greenthIndex, index) => {
		tiles[greenthIndex] = {
			id: greenthIndex,
			info: {
				sandMarks: 0,
				revealed: false,
				unrevealedType: 'Greenth',
				revealedType: greenthTiles[index],
			},
		};
	});

	// REMAINING TILES
	const sandTiles = shuffle<{
		revealedType: string;
		hintVariant?: string;
	}>([
		{ revealedType: 'Exit' },
		...Array(3).fill({ revealedType: 'Shade' }),
		...Array(8).fill({ revealedType: 'Item' }),
		...[
			'Pointer Row',
			'Pointer Col',
			'Motor Row',
			'Motor Col',
			'Core Row',
			'Core Col',
			'Fan Row',
			'Fan Col',
		].map((hintVariant) => ({ revealedType: 'Hint', hintVariant })),
	]);
	Array.from(
		{
			length: 25,
		},
		(_, index) => index,
	)
		.filter((position) => ![3, 5, 12, 19, 21].includes(position))
		.forEach((position, index) => {
			tiles[position] = {
				id: position,
				info: {
					sandMarks: 0,
					revealed: false,
					unrevealedType: 'Sand',
					revealedType: sandTiles[index].revealedType,
					hintVariant: sandTiles[index].hintVariant,
				},
			};
		});
	return tiles;
})();

const initHurricaneMeter = (playerCount: number): number[] => [
	2,
	...Array({ 2: 3, 3: 4, 4: 4, 5: 5 }[playerCount]).fill(3),
	...Array(4).fill(4),
	...Array(3).fill(5),
	...Array(2).fill(6),
	7,
];

const shuffleHurricaneCards = () => {
	const distances = [1, 2, 3];
	const directions = ['Up', 'Down', 'Left', 'Right'];

	return shuffle<string>([
		...Array(4).fill('Thirst'),
		...Array(3).fill('Hurricane Up'),
		...distances.flatMap((distance) => {
			const count = 4 - distance;

			return directions.flatMap((direction) =>
				Array(count).fill(`Move ${distance} ${direction}`),
			);
		}),
	]);
};

function shuffle<T>(items: T[]): T[] {
	const result = [...items];

	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result;
}
