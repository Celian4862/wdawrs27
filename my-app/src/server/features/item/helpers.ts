import { shuffle } from "../shared/helpers.ts";
import { itemTypes } from "./data";
import type { ItemDeck, ItemKey } from "./types";

export function shuffleItemCards(): ItemDeck {
	return shuffle<ItemKey>(
		(Object.keys(itemTypes) as ItemDeck).flatMap((key) =>
			Array(itemTypes[key].maxCount).fill(key),
		),
	);
}

export function countItemCards(itemDeck: ItemDeck) {
	const itemCounts: Record<ItemKey, number> = {
		sandRemover: 0,
		flyingTool: 0,
		thirstShield: 0,
		xRayGoggles: 0,
		addTwoWater: 0,
		speedBoost: 0,
	};
	itemDeck.forEach((item) => {
		itemCounts[item]++;
	});
	return itemCounts;
}

export function getItemName(itemKey: ItemKey) {
	return itemTypes[itemKey].info.type;
}

export function getItemDescription(itemKey: ItemKey) {
	return itemTypes[itemKey].info.description;
}
