import HurricaneMeterTick from './HurricaneMeterTick';

export default function HurricaneMeterTier({
	hurricaneMeterTier,
	span,
	startIndex,
}: {
	hurricaneMeterTier: number;
	span: number;
	startIndex: number;
}) {
	const edgeRoundingStyle =
		{ 2: 'rounded-l-xl', 7: 'rounded-r-xl' }[hurricaneMeterTier] || '';

	return (
		<div
			className={`h-12 relative py-2 flex justify-center items-center text-2xl border ${edgeRoundingStyle}`}
			style={{ gridColumn: `span ${span} / span ${span}` }}
		>
			{/**
			 *
			 * Hurricane Meter Tick
			 *
			 */}
			<HurricaneMeterTick
				hurricaneMeterTier={hurricaneMeterTier}
				span={span}
				startIndex={startIndex}
				edgeRoundingStyle={edgeRoundingStyle}
			/>
			<span className="relative z-10 font-bold">
				{hurricaneMeterTier === 7 ? '☠️' : hurricaneMeterTier}
			</span>
		</div>
	);
}
