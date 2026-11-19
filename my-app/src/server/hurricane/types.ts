import type {
	difficulties,
	hurricaneDirections,
	hurricaneDistances,
	specialCards,
} from "./data";

export type Direction = (typeof hurricaneDirections)[number];
type Distance = (typeof hurricaneDistances)[number];
type SpecialCards = (typeof specialCards)[number];
type MoveCards = `Move ${Direction} ${Distance}`;
export type CardName = SpecialCards | MoveCards;

export type HurricaneCard =
	| {
			readonly type: SpecialCards;
	  }
	| {
			readonly type: "Move";
			readonly direction: Direction;
			readonly distance: Distance;
	  };
export type HurricaneDeck = readonly HurricaneCard[];

export type Difficulty = (typeof difficulties)[number];
export type HurricaneMeterTier = 2 | 3 | 4 | 5 | 6 | 7;
export interface HurricaneMeter {
	readonly meter: readonly HurricaneMeterTier[];
	readonly progress: number;
}
