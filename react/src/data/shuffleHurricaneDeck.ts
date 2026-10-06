import { shuffle } from './shuffle';

export const hurricaneDistances = [1, 2, 3];
export const hurricaneDirections = ['Up', 'Down', 'Left', 'Right'];
export const specialCards = ['Thirst', 'Hurricane Up'];

export interface HurricaneCard {
	type: string;
	distance?: number;
	direction?: string;
}

export function shuffleHurricaneDeck() {
	return shuffle<HurricaneCard>([
		...Array(4).fill({ type: 'Thirst' }),
		...Array(3).fill({ type: 'Hurricane Up' }),
		...hurricaneDistances.flatMap((distance) => {
			const count = 4 - distance;

			return hurricaneDirections.flatMap((direction) =>
				Array(count).fill({ type: 'Move', distance, direction }),
			);
		}),
	]);
}
