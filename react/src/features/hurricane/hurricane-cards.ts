export const distances = [
	1,
	2,
	3,
] as const;
type Distance = (typeof distances)[number];
export const directions = [
	'Up',
	'Down',
	'Left',
	'Right',
] as const;
type Direction = (typeof directions)[number];
export type HurricaneCard =
	| 'Thirst'
	| 'Hurricane Up'
	| `Move ${Distance} ${Direction}`;

export const hurricaneCards: HurricaneCard[] = [
	...Array(4).fill('Thirst'),
	...Array(3).fill('Hurricane Up'),
	...(
		[
			1,
			2,
			3,
		] as const
	).flatMap((distance) => {
		// Move 1 = 3 copies, Move 2 = 2 copies, Move 3 = 1 copy
		const count = 4 - distance;

		return directions.flatMap((direction) =>
			Array(count).fill(`Move ${distance} ${direction}` as HurricaneCard),
		);
	}),
];
