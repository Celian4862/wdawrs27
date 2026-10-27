import type {
	difficulties,
	hurricaneDirections,
	hurricaneDistances,
	specialCards,
} from './data';

export type Direction = (typeof hurricaneDirections)[number];
type Distance = (typeof hurricaneDistances)[number];
type SpecialCards = (typeof specialCards)[number];
type MoveCards = `Move ${Direction} ${Distance}`;
export type CardName = SpecialCards | MoveCards;

export type HurricaneCard =
	| {
			type: SpecialCards;
	  }
	| {
			type: 'Move';
			direction: Direction;
			distance: Distance;
	  };

export type Difficulty = (typeof difficulties)[number];
export type HurricaneMeterTier = 2 | 3 | 4 | 5 | 6 | 7;
export type HurricaneMeter = HurricaneMeterTier[];
