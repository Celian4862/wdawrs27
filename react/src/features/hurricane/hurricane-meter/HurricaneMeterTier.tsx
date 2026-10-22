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
			className={`text-l relative flex h-10 items-center justify-center border py-2 ${edgeRoundingStyle}`}
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
