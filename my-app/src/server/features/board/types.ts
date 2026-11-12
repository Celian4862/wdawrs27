import type { hurricaneId, partNames, partOrientations, tileIds } from "./data";

interface GreenthTile {
	readonly unrevealedType: "Greenth";
	readonly revealedType: "Water" | "Fake";
}

export type PartNames = (typeof partNames)[number];

export type PartOrientation = (typeof partOrientations)[number];

export interface HintTile {
	readonly revealedType: PartNames;
	readonly partOrientation: PartOrientation;
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
	readonly parts: PartNames[];
} & (StartTile | GreenthTile | SandTile);

export type TileStatus =
	| BoardTile["unrevealedType"]
	| BoardTile["revealedType"];
export type Tile = HurricaneTile | BoardTile;
export type Board = readonly Tile[];
