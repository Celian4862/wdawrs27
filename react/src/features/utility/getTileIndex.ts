import type { Tile } from '@/board/tiles';
import type { ActivePlayer } from '@/player/players';

export function getPlayerTileIndex(board: Tile[], player: ActivePlayer) {
	const currentTileIndex = board.findIndex(
		(tile) => tile.id === player.currentTileId,
	);
	return currentTileIndex;
}
