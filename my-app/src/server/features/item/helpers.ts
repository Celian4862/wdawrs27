import { shuffle } from "../shared/helpers.ts";
import { itemTypes } from "./data";
import type { ItemCard, ItemDeck } from "./types";

export function shuffleItemCards(): ItemDeck {
	return shuffle<ItemCard>([
		...Array(itemTypes.sandRemover.maxCount).fill(itemTypes.sandRemover.info),
		...Array(itemTypes.flyingTool.maxCount).fill(itemTypes.flyingTool.info),
		...Array(itemTypes.thirstShield.maxCount).fill(itemTypes.thirstShield.info),
		...Array(itemTypes.xRayGoggles.maxCount).fill(itemTypes.xRayGoggles.info),
		...Array(itemTypes.addTwoWater.maxCount).fill(itemTypes.addTwoWater.info),
		...Array(itemTypes.speedBoost.maxCount).fill(itemTypes.speedBoost.info),
	]);
}
