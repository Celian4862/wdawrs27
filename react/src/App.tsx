import { useState } from 'react';

export default function App() {
	const [playerCount, setPlayerCount] = useState(0);
	const [currentHurricaneMeterProgress, setCurrentHurricaneMeterProgress] =
		useState(-1);

	// Guarantees that playerCount will not be 0 by the time it initializes other game states
	if (playerCount === 0) {
		return (
			<div className="h-screen flex justify-center">
				<div className="flex flex-col justify-center">
					<div className="md:w-100 text-center">
						<h1>How many players?</h1>
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

	const hurricaneMeter = initHurricaneMeter(playerCount);
	if (currentHurricaneMeterProgress < 0) {
		return (
			<div className="h-screen flex justify-center">
				<div className="flex flex-col justify-center">
					<div className="md:w-100 text-center">
						<h1>What difficulty level?</h1>
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
							className={`border rounded-lg size-20 motion-safe:transition ${!tile.info ? 'brightness-50' : 'hover:brightness-50'}`}
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
			<section className="py-5 md:p-5 max-w-screen">
				{/**
				 *
				 * Hurricane Meter
				 *
				 */}
				<section className="mb-6 grid grid-rows-2">
					<h1>Hurricane Meter (Cards to Draw)</h1>
					{/**
					 *
					 * Hurricane Meter Overflow Container
					 *
					 */}
					<div className="overflow-x-auto">
						{/**
						 *
						 * Hurricane Meter Grid
						 *
						 */}
						<div
							className={`min-w-150 grid ${{ 2: 'grid-cols-14', 3: 'grid-cols-15', 4: 'grid-cols-15', 5: 'grid-cols-16' }[playerCount]}`}
						>
							{/**
							 *
							 * Hurricane Meter Loop
							 *
							 */}
							{Array.from(new Set(hurricaneMeter)).map((hurricaneMeterTier) => {
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
							})}
						</div>
					</div>
				</section>
				{/**
				 *
				 * Hurricane Deck
				 *
				 */}
				<section className="border rounded-xl p-6 mb-6">
					<h1>Hurricane Deck</h1>
				</section>
				{/**
				 *
				 * Item Deck
				 *
				 */}
				<section className="border rounded-xl p-6">
					<h1>Item Deck</h1>
				</section>
			</section>
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

function shuffle<T>(items: T[]): T[] {
	const result = [...items];

	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result;
}
