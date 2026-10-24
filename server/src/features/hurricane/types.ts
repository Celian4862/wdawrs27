import type {
	hurricaneDirections,
	hurricaneDistances,
	specialCards,
} from './data';

export type HurricaneDirection = (typeof hurricaneDirections)[number];
type HurricaneDistance = (typeof hurricaneDistances)[number];
type SpecialCards = (typeof specialCards)[number];

export type HurricaneCard =
	| {
			type: SpecialCards;
	  }
	| {
			type: 'Move';
			direction: HurricaneDirection;
			distance: HurricaneDistance;
	  };
