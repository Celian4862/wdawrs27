import { useGame } from './GameContext';
import GameInfoHeading from './game-info/GameInfoHeading';
import GameInfoSection from './game-info/GameInfoSection';

export default function Parts() {
	const { state } = useGame();
	return (
		<GameInfoSection>
			<GameInfoHeading heading="Parts Collected" subheading={` / 4`} />
			<div className="flex flex-wrap">
				{state.partsCollected.map((part) => (
					<div key={part} className="p-3">
						{part}
					</div>
				))}
			</div>
		</GameInfoSection>
	);
}
