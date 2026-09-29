type HurricaneCard =
	| 'Thirst'
	| 'Hurricane Up'
	| 'Move 1 Up'
	| 'Move 1 Down'
	| 'Move 1 Left'
	| 'Move 1 Right'
	| 'Move 2 Up'
	| 'Move 2 Down'
	| 'Move 2 Left'
	| 'Move 2 Right'
	| 'Move 3 Up'
	| 'Move 3 Down'
	| 'Move 3 Left'
	| 'Move 3 Right';

export const hurricaneCards: HurricaneCard[] = [
	...Array(4).fill('Thirst'),
	...Array(3).fill('Hurricane Up'),
	...Array(3).fill('Move 1 Up'),
	...Array(3).fill('Move 1 Down'),
	...Array(3).fill('Move 1 Left'),
	...Array(3).fill('Move 1 Right'),
	...Array(2).fill('Move 2 Up'),
	...Array(2).fill('Move 2 Down'),
	...Array(2).fill('Move 2 Left'),
	...Array(2).fill('Move 2 Right'),
	'Move 3 Up',
	'Move 3 Down',
	'Move 3 Left',
	'Move 3 Right',
];
