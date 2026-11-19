import type { itemTypes } from "./data";

export type ItemKey = keyof typeof itemTypes;
export type ItemDeck = readonly ItemKey[];
