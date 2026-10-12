import { type ActivePlayer } from './players';
import type { Tile } from './tiles';

export function getTileIndex(board: Tile[], player: ActivePlayer) {
	const currentTileIndex = board.findIndex(
		(tile) => tile.id === player.currentTileId,
	);
	return currentTileIndex;
}
