import { shuffle } from './shuffle';

export const shuffleHurricaneCards = () => {
	const distances = [1, 2, 3];
	const directions = ['Up', 'Down', 'Left', 'Right'];

	return shuffle<string>([
		...Array(4).fill('Thirst'),
		...Array(3).fill('Hurricane Up'),
		...distances.flatMap((distance) => {
			const count = 4 - distance;

			return directions.flatMap((direction) =>
				Array(count).fill(`Move ${distance} ${direction}`),
			);
		}),
	]);
};
