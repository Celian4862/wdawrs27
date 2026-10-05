export const initHurricaneMeter = (playerCount: number): number[] => [
	2,
	...Array({ 2: 3, 3: 4, 4: 4, 5: 5 }[playerCount]).fill(3),
	...Array(4).fill(4),
	...Array(3).fill(5),
	...Array(2).fill(6),
	7,
];
