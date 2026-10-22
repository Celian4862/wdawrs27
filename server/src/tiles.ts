interface WaterTile {
	revealedType: 'Water';
	revealedTileColor: 'bg-blue-700';
}

interface FakeTile {
	revealedType: 'Fake';
	revealedTileColor: 'bg-amber-700';
}

type GreenthTile = {
	unrevealedType: 'Greenth';
	unrevealedTileColor: 'bg-lime-600';
} & (WaterTile | FakeTile);

interface ExitTile {
	revealedType: 'Exit';
	revealedTileColor: 'bg-white/80';
}

interface ItemTile {
	revealedType: 'Item';
	revealedTileColor: 'bg-slate-700';
}

interface ShadeTile {
	revealedType: 'Shade';
	revealedTileColor: 'bg-black';
}

interface RowTile {
	partOrientation: 'Row';
	orientationEmoji: '↔️';
}

interface ColTile {
	partOrientation: 'Col';
	orientationEmoji: '↕️';
}

interface CoreTile {
	partHint: 'Core';
	revealedTileColor: 'bg-orange-500';
}

interface FanTile {
	partHint: 'Fan';
	revealedTileColor: 'bg-yellow-600';
}

interface MotorTile {
	partHint: 'Motor';
	revealedTileColor: 'bg-gray-400';
}

interface PointerTile {
	partHint: 'Pointer';
	revealedTileColor: 'bg-red-950';
}

type PartTile = CoreTile | FanTile | MotorTile | PointerTile;

type OrientationTile = RowTile | ColTile;

type HintTile = {
	revealedType: 'Hint';
} & OrientationTile &
	PartTile;

type RevSandTile = ExitTile | ItemTile | ShadeTile | HintTile;

type SandTile = {
	unrevealedType: 'Sand';
	unrevealedTileColor: 'bg-yellow-300/80';
} & RevSandTile;

interface StartTile extends ItemTile {
	unrevealedType: 'Start';
	unrevealedTileColor: 'bg-red-700';
}

interface HurricaneTile {
	type: 'hurricane';
	id: 12;
}

type BoardTile = {
	type: 'board';
	id: number;
} & {
	sandPoints: number;
	revealed: boolean;
	parts: Set<'🧭' | '⚡' | '💎' | '🌀'>;
} & (StartTile | GreenthTile | SandTile);

export type Tile = HurricaneTile | BoardTile;
