import { countItemCards } from '@/features/item/items';
import GameInfoHeading from '../game-info/GameInfoHeading';
import GameInfoSection from '../game-info/GameInfoSection';
import { useGame } from '../utility/GameContext';

export default function ItemDeck() {
	const { state } = useGame();
	const drawnItems = countItemCards(state.itemDeck);

	return (
		<GameInfoSection>
			<GameInfoHeading
				heading="Item Deck"
				subheading={`${state.itemDeck.length} items in stock`}
			/>
			<table className="py-1 w-full text-lg text-center border rounded-lg border-separate border-spacing-2">
				<thead>
					<tr>
						<th>Items</th>
						<th>Stock</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(drawnItems).map((drawnItem) => {
						return (
							<tr
								key={drawnItem}
								className={`${state.recentlyDrawnItemCard === drawnItem ? 'bg-slate-500' : ''}`}
							>
								<td>{drawnItem}</td>
								<td>{drawnItems[drawnItem]}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</GameInfoSection>
	);
}
