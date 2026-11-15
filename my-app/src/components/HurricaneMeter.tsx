import type { HurricaneMeter as HurricaneMeterType } from "#/server/features/hurricane/types";

export default function HurricaneMeter({
	hurricaneMeter,
}: {
	hurricaneMeter: HurricaneMeterType;
}) {
	const meterTickCounts = {
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
	};
	hurricaneMeter.meter.forEach((tier) => {
		meterTickCounts[tier]++;
	});
	let accumulatedTicksCount = 0;

	return (
		<div
			className="grid md:min-w-0"
			style={{
				gridTemplateColumns: `repeat(${hurricaneMeter.meter.length}, minmax(0, 1fr))`,
			}}
		>
			{Array.from(new Set(hurricaneMeter.meter)).map((hurricaneMeterTier) => {
				const span = meterTickCounts[hurricaneMeterTier] ?? 0;
				const startIndex = accumulatedTicksCount;
				accumulatedTicksCount += span;
				const edgeRoundingStyle = (() => {
					switch (hurricaneMeterTier) {
						case 2:
							return "rounded-l-xl";
						case 7:
							return "rounded-r-xl";
						default:
							return "";
					}
				})();

				return (
					<div
						key={hurricaneMeterTier}
						className={`text-l relative flex h-10 items-center justify-center border py-2 ${edgeRoundingStyle}`}
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
								const isFilled = globalIndex <= hurricaneMeter.progress;
								const fillColor = isFilled
									? {
											2: "bg-amber-400/90",
											3: "bg-amber-500/90",
											4: "bg-amber-600/90",
											5: "bg-amber-700/90",
											6: "bg-amber-800/90",
											7: "bg-red-600/90",
										}[hurricaneMeterTier]
									: "bg-transparent";
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
							{hurricaneMeterTier === 7 ? "☠️" : hurricaneMeterTier}
						</span>
					</div>
				);
			})}
		</div>
	);
}
