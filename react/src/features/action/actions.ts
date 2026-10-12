import type { ActivePlayer } from '@/features/player/players';
import type { Tile } from '../board/tiles';

export function getTileIndex(board: Tile[], player: ActivePlayer) {
	const currentTileIndex = board.findIndex(
		(tile) => tile.id === player.currentTileId,
	);
	return currentTileIndex;
}
