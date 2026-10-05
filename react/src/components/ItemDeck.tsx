import { maxItemCounts } from '@/data/items';
import { useGame } from './GameContext';
import GameInfoHeading from './game-info/GameInfoHeading';
import GameInfoSection from './game-info/GameInfoSection';

export default function ItemDeck() {
	const { state } = useGame();

	return (
		<GameInfoSection>
			<GameInfoHeading
				heading="Item Deck"
				subheading={`${state.itemDeckCounter} / 12`}
			/>
			<table className="py-1 min-w-110 w-full text-lg text-center border rounded-lg border-separate border-spacing-2 table-fixed">
				<thead>
					<tr>
						<th>Items</th>
						<th>Stock</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(state.drawnItemDeck).map((drawnItem) => {
						return (
							<tr key={drawnItem}>
								<td>{drawnItem}</td>
								<td>
									{maxItemCounts[drawnItem] - state.drawnItemDeck[drawnItem]}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</GameInfoSection>
	);
}
