import type { HurricaneMeter as HurricaneMeterType } from "#/server/features/hurricane/types";

export default function HurricaneMeter({
	hurricaneMeter,
	playersLength,
}: {
	hurricaneMeter: HurricaneMeterType;
	playersLength: number;
}) {
	let accumulatedTicksCount = 0;

	return (
		<div
			className={`grid ${
				{
					2: "grid-cols-14",
					3: "grid-cols-15",
					4: "grid-cols-15",
					5: "grid-cols-16",
				}[playersLength]
			} md:min-w-0`}
		>
			{Array.from(new Set(hurricaneMeter.meter)).map((hurricaneMeterTier) => {
				const span =
					{
						2: 1,
						3: { 2: 3, 3: 4, 4: 4, 5: 5 }[playersLength],
						4: 4,
						5: 3,
						6: 2,
						7: 1,
					}[hurricaneMeterTier] ?? 0;
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
