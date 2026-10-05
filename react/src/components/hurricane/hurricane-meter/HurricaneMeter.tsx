import { useGame } from '@/components/GameContext';
import HurricaneMeterTier from './HurricaneMeterTier';

export default function HurricaneMeter({
	hurricaneMeter,
}: {
	hurricaneMeter: number[];
}) {
	const { state } = useGame();
	let accumulatedTicksCount = 0;

	return (
		<div className="grid">
			<div className="overflow-x-auto">
				<div
					className={`min-w-150 grid ${
						{
							2: 'grid-cols-14',
							3: 'grid-cols-15',
							4: 'grid-cols-15',
							5: 'grid-cols-16',
						}[state.playerCount]
					} md:min-w-0`}
				>
					{Array.from(new Set(hurricaneMeter)).map((hurricaneMeterTier) => {
						const span =
							{
								2: 1,
								3: { 2: 3, 3: 4, 4: 4, 5: 5 }[state.playerCount],
								4: 4,
								5: 3,
								6: 2,
								7: 1,
							}[hurricaneMeterTier] ?? 0;
						const startIndex = accumulatedTicksCount;
						accumulatedTicksCount += span;

						return (
							<HurricaneMeterTier
								key={hurricaneMeterTier}
								hurricaneMeterTier={hurricaneMeterTier}
								span={span}
								startIndex={startIndex}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}
