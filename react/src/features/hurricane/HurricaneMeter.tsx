import type { PlayerCount } from '../player/player-cards';
import {
	getCurrentCardDrawCount,
	getStormConfig,
	type StormLevelTier,
} from './hurricane-meter';

export default function HurricaneMeter({
	playerCount,
	currentIndex,
}: HurricaneMeterProps) {
	const config = getStormConfig(playerCount);
	const totalTicks = config.reduce((sum, tier) => sum + tier.tickCount, 0);
	const safeCurrentIndex = Math.max(0, Math.min(currentIndex, totalTicks));
	const activeLevelIndex = getActiveLevelIndex(config, safeCurrentIndex);
	const activeTier = config[activeLevelIndex];
	const currentCardCount = getCurrentCardDrawCount(
		playerCount,
		safeCurrentIndex,
	);
	const activeMeterWidth = (safeCurrentIndex / Math.max(totalTicks, 1)) * 100;
	let cumulativeTicks = 0;

	return (
		<section className="mb-5 w-full max-w-xl rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-5 shadow-2xl shadow-black/30">
			<header className="flex items-end justify-between gap-4 pb-5">
				<div>
					<p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">
						Hurricane meter
					</p>
					<h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
						Hurricane track
					</h2>
				</div>
				<div className="text-right">
					<p className="text-3xl font-bold text-white tabular-nums">
						{currentCardCount ?? activeTier.cardCount}
					</p>
					<p className="text-xs tracking-wider text-white/50 uppercase">
						Cards / draw
					</p>
				</div>
			</header>

			<div className="relative">
				<div className="relative h-12 overflow-hidden rounded-full border border-white/10 bg-slate-900/80">
					<div
						className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-rose-400 shadow-[0_0_20px_rgba(34,211,238,0.55)]"
						style={{
							width: `${activeMeterWidth}%`,
						}}
					/>

					{config.map((tier, index) => {
						const segmentWidth = (tier.tickCount / totalTicks) * 100;
						const left = (cumulativeTicks / totalTicks) * 100;
						cumulativeTicks += tier.tickCount;
						const isActive = index === activeLevelIndex;
						const isPast = index < activeLevelIndex;

						return (
							<div
								key={`${tier.cardCount}-${tier.tickCount}`}
								className="absolute inset-y-0"
								style={{
									left: `${left}%`,
									width: `${segmentWidth}%`,
								}}
							>
								<div
									className={`absolute inset-y-[10%] left-0 right-0 rounded-full border ${
										isPast
											? 'border-rose-300/60 bg-rose-400/40'
											: isActive
												? 'border-cyan-200/80 bg-cyan-300/50'
												: 'border-white/15 bg-white/5'
									} `}
								/>
							</div>
						);
					})}

					{config.map((tier, index) => {
						const tickPosition =
							(config
								.slice(0, index + 1)
								.reduce((sum, level) => sum + level.tickCount, 0) /
								totalTicks) *
							100;

						return (
							<div
								key={`tick-${tier.cardCount}`}
								className="absolute inset-y-0 w-px bg-white/60"
								style={{
									left: `${tickPosition}%`,
								}}
							/>
						);
					})}

					<div
						className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.9)]"
						style={{
							left: `${Math.min(activeMeterWidth, 98)}%`,
						}}
					/>

					<span className="absolute right-1 top-1/2 -translate-y-1/2 text-2xl drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
						☠️
					</span>
				</div>

				<div className="mt-3 grid grid-cols-5 gap-2 text-center text-xs font-semibold tracking-[0.15em] text-white/70 uppercase">
					{config.map((tier) => (
						<span
							key={`${tier.cardCount}-label`}
							className={
								tier.cardCount === activeTier.cardCount
									? 'text-cyan-300'
									: 'text-white/70'
							}
						>
							{tier.cardCount}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}

interface HurricaneMeterProps {
	playerCount: PlayerCount;
	currentIndex: number;
}

function getActiveLevelIndex(
	config: StormLevelTier[],
	currentIndex: number,
): number {
	let cumulativeTicks = 0;

	for (let index = 0; index < config.length; index += 1) {
		const tier = config[index];
		const nextBreakpoint = cumulativeTicks + tier.tickCount;

		if (currentIndex < nextBreakpoint) {
			return index;
		}

		cumulativeTicks = nextBreakpoint;
	}

	return config.length - 1;
}
