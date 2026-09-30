import type { TileDefinition, TileType } from './tileTypes';

export const toIndex = (row: number, col: number) => row * 5 + col;

export const createTile = (
	id: number,
	tileDefinition?: TileDefinition,
): TileType => ({
	id,
	info: tileDefinition && {
		revealed: false,
		...tileDefinition,
	},
});

// Overload 1: Hint tiles
export function createTileDefinition(
	unrevealedType: 'Sand',
	revealedType: 'Hint',
	hintVariant: TileDefinition['hintVariant'],
): TileDefinition;
// Overload 2: Standard tiles
export function createTileDefinition(
	unrevealedType: TileDefinition['unrevealedType'],
	revealedType: TileDefinition['revealedType'],
	hintVariant?: never,
): TileDefinition;
// Implementation
export function createTileDefinition(
	unrevealedType: unknown,
	revealedType: unknown,
	hintVariant?: unknown,
): TileDefinition {
	return {
		unrevealedType: unrevealedType,
		revealedType: revealedType,
		hintVariant,
	} as TileDefinition;
}
