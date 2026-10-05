import { useGame } from '@/components/GameContext';
import GameInfoHeading from '@/components/game-info/GameInfoHeading';
import GameInfoSection from '@/components/game-info/GameInfoSection';
import HurricaneMeter from '@/components/hurricane/hurricane-meter/HurricaneMeter';

export default function HurricaneMeterSection() {
	const { state } = useGame();

	return (
		<GameInfoSection>
			<GameInfoHeading
				heading="Hurricane Meter"
				subheading={`${state.hurricaneMeter[state.meterProgress] === 7 ? '☠️' : state.hurricaneMeter[state.meterProgress]} / turn`}
			/>
			<HurricaneMeter hurricaneMeter={state.hurricaneMeter} />
		</GameInfoSection>
	);
}
