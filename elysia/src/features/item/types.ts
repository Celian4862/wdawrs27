import type { itemTypes } from './data';

export type ItemKey = keyof typeof itemTypes;
export type ItemCard = typeof itemTypes;
