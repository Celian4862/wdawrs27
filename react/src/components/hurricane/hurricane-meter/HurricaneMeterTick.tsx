import { useGame } from '@/components/GameContext';

export default function HurricaneMeterTick({
	hurricaneMeterTier,
	span,
	startIndex,
	edgeRoundingStyle,
}: {
	hurricaneMeterTier: number;
	span: number;
	startIndex: number;
	edgeRoundingStyle: string;
}) {
	const { state } = useGame();

	return (
		<div className={`absolute inset-0 grid grid-flow-col`}>
			{Array.from({ length: span }).map((_, tickIndex) => {
				const globalIndex = startIndex + tickIndex;
				const isFilled = globalIndex <= state.meterProgress;
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
	);
}
