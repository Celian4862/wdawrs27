import { type ActivePlayer, findCurrentPlayer } from './players';
import type { Tile } from './tiles';

export function getTilePlayer(board: Tile[], players: ActivePlayer[]) {
	const currentPlayerIndex = findCurrentPlayer(players);
	const currentTileIndex = board.findIndex(
		(tile) => tile.id === players[currentPlayerIndex].currentTileId,
	);
	return { currentPlayerIndex, currentTileIndex };
}
