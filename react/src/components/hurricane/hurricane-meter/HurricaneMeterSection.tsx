import { useGame } from '@/components/GameContext';
import GameInfoHeading from '@/components/GameInfoHeading';
import HurricaneMeter from '@/components/hurricane/hurricane-meter/HurricaneMeter';

export default function HurricaneMeterSection() {
	const { state } = useGame();

	return (
		<section className="border rounded-xl p-6">
			<GameInfoHeading
				heading="Hurricane Meter"
				subheading={`${state.hurricaneMeter[state.meterProgress] === 7 ? '☠️' : state.hurricaneMeter[state.meterProgress]} / turn`}
			/>
			<HurricaneMeter hurricaneMeter={state.hurricaneMeter} />
		</section>
	);
}
