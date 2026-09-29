import {
	directions as DIRECTIONS,
	distances,
	type HurricaneCard,
} from './hurricane-cards';

const DISTANCE_CONFIG = distances.map((distance) => ({
	distance: distance,
	label: `${distance === 1 ? '1 space' : `${distance} spaces`}`,
	max: 4 - distance,
}));

const SPECIAL_CARDS = {
	Thirst: 4,
	'Hurricane Up': 3,
} as const;

interface HurricaneDeckProps {
	cardCounts: Record<HurricaneCard, number>;
	drawnCardsCount: number;
}

export default function HurricaneDeck({
	cardCounts,
	drawnCardsCount,
}: HurricaneDeckProps) {
	return (
		<section className="mb-5 w-full max-w-xl space-y-5 rounded-xl border border-white/15 bg-white/5 p-5 shadow-2xl shadow-black/30">
			<header className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
				<div>
					<p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">
						Hurricane deck
					</p>
					<h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
						Draw progress
					</h2>
				</div>
				<div className="text-right">
					<p className="text-3xl font-bold text-white tabular-nums">
						{drawnCardsCount}
						<span className="text-base font-normal text-white/45"> / 31</span>
					</p>
					<p className="text-xs tracking-wider text-white/50 uppercase">
						cards drawn
					</p>
				</div>
			</header>

			<div className="grid md:grid-cols-2 gap-3">
				{(Object.keys(SPECIAL_CARDS) as (keyof typeof SPECIAL_CARDS)[]).map(
					(cardName) => {
						const count = cardCounts[cardName] ?? 0;
						const max = SPECIAL_CARDS[cardName];
						const isThirst = cardName === 'Thirst';

						return (
							<div
								key={cardName}
								className={`rounded-lg border p-4 ${
									isThirst
										? 'border-amber-300/20 bg-amber-300/10 text-amber-100'
										: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100'
								}`}
							>
								<p className="text-sm opacity-70">{cardName}</p>
								<p className="mt-1 text-2xl font-semibold tabular-nums">
									{count}
									<span className="text-base font-normal text-white/45">
										{' '}
										/ {max}
									</span>
								</p>
							</div>
						);
					},
				)}
			</div>

			<div>
				<div className="mb-3 flex items-baseline justify-between gap-3">
					<h3 className="text-sm font-semibold tracking-[0.16em] text-white/80 uppercase">
						Movement cards
					</h3>
				</div>
				<div className="overflow-hidden rounded-lg border border-white/10">
					<div className="grid grid-cols-[minmax(4.5rem,1.2fr)_repeat(4,minmax(0,1fr))] bg-white/10 px-2 py-2 text-center text-xs font-semibold tracking-wider text-white/55 uppercase">
						<span className="text-left">Move</span>
						{DIRECTIONS.map((dir) => (
							<span key={dir}>{dir}</span>
						))}
					</div>
					<div className="divide-y divide-white/10">
						{DISTANCE_CONFIG.map(({ distance, label, max }) => (
							<div
								key={distance}
								className="grid grid-cols-[minmax(4.5rem,1.2fr)_repeat(4,minmax(0,1fr))] items-center px-2 py-3 text-center"
							>
								<span className="text-left text-sm font-medium text-white/80">
									{label}
								</span>
								{DIRECTIONS.map((direction) => {
									const cardKey =
										`Move ${distance} ${direction}` as HurricaneCard;
									const count = cardCounts[cardKey] ?? 0;

									return (
										<span key={direction} className="text-white">
											{count}
											<span className="text-base font-normal text-white/45">
												{' '}
												/ {max}
											</span>
										</span>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
