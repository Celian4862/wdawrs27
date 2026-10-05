import { useGame } from './GameContext';
import GameInfoHeading from './game-info/GameInfoHeading';
import GameInfoSection from './game-info/GameInfoSection';

export default function ItemDeck() {
	const { state } = useGame();

	return (
		<GameInfoSection>
			<GameInfoHeading
				heading="Item Deck"
				subheading={`${12 - state.itemDeckCounter} / 12`}
			/>
		</GameInfoSection>
	);
}
