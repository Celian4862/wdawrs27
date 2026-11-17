import { itemTypes } from "#/server/features/item/data";
import { countItemCards } from "#/server/features/item/helpers";
import type {
	ItemDeck as ItemDeckType,
	ItemKey,
} from "#/server/features/item/types";

export default function ItemDeck({
	itemDeck,
	recentlyDrawnItemCard,
}: {
	itemDeck: ItemDeckType;
	recentlyDrawnItemCard: ItemKey | "";
}) {
	const drawnItems = countItemCards(itemDeck);

	return (
		<section className="rounded-xl border p-6">
			<div className="mb-3 flex flex-wrap items-center justify-between">
				<h1 className="text-2xl">Item Deck</h1>
				<h2 className="text-xl">{itemDeck.length} items in stock</h2>
			</div>
			<table className="w-full border-separate border-spacing-2 rounded-lg border py-1 text-center text-lg">
				<thead>
					<tr>
						<th>Items</th>
						<th>Stock</th>
					</tr>
				</thead>
				<tbody>
					{(Object.keys(drawnItems) as ItemKey[]).map((drawnItem) => {
						return (
							<tr
								key={drawnItem}
								className={`${recentlyDrawnItemCard === drawnItem ? "bg-slate-500" : ""}`}
							>
								<td>{itemTypes[drawnItem].info.type}</td>
								<td>{drawnItems[drawnItem]}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</section>
	);
}
