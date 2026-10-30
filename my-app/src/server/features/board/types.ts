import type { hurricaneId, partNames, partOrientations, tileIds } from "./data";

interface GreenthTile {
	readonly unrevealedType: "Greenth";
	readonly revealedType: "Water" | "Fake";
}

type PartNames = (typeof partNames)[number];

export interface HintTile {
	readonly revealedType: "Hint";
	readonly partHint: PartNames;
	readonly partOrientation: (typeof partOrientations)[number];
}

type OtherRevNames = "Exit" | "Item" | "Shade";

export interface OtherRevTile {
	readonly revealedType: OtherRevNames;
}

export type RevSandTile = OtherRevTile | HintTile;

type SandTile = {
	readonly unrevealedType: "Sand";
} & RevSandTile;

interface StartTile {
	readonly unrevealedType: "Start";
	readonly revealedType: "Item";
}

interface HurricaneTile {
	readonly id: typeof hurricaneId;
}

type BoardTile = {
	readonly id: (typeof tileIds)[number];
	readonly sandPoints: number;
	readonly revealed: boolean;
	readonly parts: ReadonlySet<PartNames>;
} & (StartTile | GreenthTile | SandTile);

export type Tile = HurricaneTile | BoardTile;
export type Board = readonly Tile[];
