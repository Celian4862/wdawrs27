import type { Tile } from '@/features/board/tiles';
import type { ActivePlayer } from '@/features/player/players';

export function getTileIndex(board: Tile[], player: ActivePlayer) {
	const currentTileIndex = board.findIndex(
		(tile) => tile.id === player.currentTileId,
	);
	return currentTileIndex;
}
