import type { hurricaneId, partNames, partOrientations, tileIds } from './data';

interface GreenthTile {
	unrevealedType: 'Greenth';
	revealedType: 'Water' | 'Fake';
}

type PartNames = (typeof partNames)[number];

export interface HintTile {
	revealedType: 'Hint';
	partHint: PartNames;
	partOrientation: (typeof partOrientations)[number];
}

type OtherRevNames = 'Exit' | 'Item' | 'Shade';

export interface OtherRevTile {
	revealedType: OtherRevNames;
}

export type RevSandTile = OtherRevTile | HintTile;

type SandTile = {
	unrevealedType: 'Sand';
} & RevSandTile;

interface StartTile {
	unrevealedType: 'Start';
	revealedType: 'Item';
}

interface HurricaneTile {
	id: typeof hurricaneId;
}

type BoardTile = {
	id: (typeof tileIds)[number];
	sandPoints: number;
	revealed: boolean;
	parts: Set<PartNames>;
} & (StartTile | GreenthTile | SandTile);

export type Tile = HurricaneTile | BoardTile;
export type Board = readonly Tile[];
