import {
	hurricaneDirections,
	hurricaneDistances,
} from "#/server/features/hurricane/data";
import { countHurricaneCards } from "#/server/features/hurricane/helpers";
import type {
	CardName,
	HurricaneCard,
	HurricaneDeck as HurricaneDeckType,
} from "#/server/features/hurricane/types";

export default function HurricaneDeck({
	hurricaneDeck,
	recentlyDrawnHurricaneCard,
	sandPoints,
}: {
	hurricaneDeck: HurricaneDeckType;
	recentlyDrawnHurricaneCard: HurricaneCard;
	sandPoints: number;
}) {
	const hurricaneCount = countHurricaneCards(hurricaneDeck);
	return (
		<section className="rounded-xl border p-6">
			<div className="mb-3 flex flex-wrap items-center justify-between">
				<h1 className="text-2xl">Hurricane Deck</h1>
				<h2 className="text-xl">{hurricaneDeck.length} cards</h2>
			</div>
			<div className="grid gap-3 *:rounded-lg *:border *:py-1 *:text-lg md:grid-cols-2">
				<div
					className={`${recentlyDrawnHurricaneCard.type === "Thirst" ? "bg-blue-700" : "bg-none"} flex items-center justify-around`}
				>
					<h3 className="font-bold">Thirst</h3>
					<span>{hurricaneCount.Thirst ?? 0}</span>
				</div>
				<div
					className={`${recentlyDrawnHurricaneCard.type === "Hurricane Up" ? "bg-red-700/80" : "bg-none"} flex flex-wrap items-center justify-around`}
				>
					<h3 className="font-bold">Hurricane Up</h3>
					<span>{hurricaneCount["Hurricane Up"] ?? 0}</span>
				</div>

				<table className="w-full border-separate border-spacing-2 text-center md:col-span-2">
					<thead>
						<tr>
							<th>Move</th>
							<th>1</th>
							<th>2</th>
							<th>3</th>
						</tr>
					</thead>
					<tbody>
						{hurricaneDirections.map((direction) => {
							return (
								<tr key={direction}>
									<td>{direction}</td>

									{hurricaneDistances.map((distance) => {
										const moveString: CardName = `Move ${direction} ${distance}`;

										return (
											<td
												key={moveString}
												className={
													recentlyDrawnHurricaneCard.type === "Move" &&
													recentlyDrawnHurricaneCard.distance === distance &&
													recentlyDrawnHurricaneCard.direction === direction
														? "bg-amber-500"
														: "bg-black"
												}
											>
												{hurricaneCount[moveString] ?? 0}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
				<div className="flex flex-wrap items-center justify-around md:col-span-2">
					<h3 className="font-bold">Sand Point Stock: </h3>
					{sandPoints} / 48
				</div>
			</div>
		</section>
	);
}
