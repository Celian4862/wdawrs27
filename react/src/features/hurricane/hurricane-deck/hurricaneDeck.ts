import { shuffle } from '../../utility/shuffle';

export const hurricaneDistances = [1, 2, 3];
export const hurricaneDirections = ['Up', 'Down', 'Left', 'Right'];
const specialCards = ['Thirst', 'Hurricane Up'];

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

export function countHurricaneCards(hurricaneDeck: HurricaneCard[]) {
	const toCardKey = (card: HurricaneCard) => {
		return specialCards.includes(card.type)
			? card.type
			: `Move ${card.distance} ${card.direction}`;
	};
	const hurricaneCounts = Object.fromEntries(
		hurricaneDeck.map((key) => {
			if (specialCards.includes(key.type)) {
				return [key.type, 0];
			}
			return [`Move ${key.distance} ${key.direction}`, 0];
		}),
	);
	hurricaneDeck.forEach((card) => {
		hurricaneCounts[toCardKey(card)]++;
	});
	return hurricaneCounts;
}
