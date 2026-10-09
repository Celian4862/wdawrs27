import { findCurrentPlayer, type ActivePlayer } from "./players";
import type { Tile } from "./tiles";

export function getTilePlayer(board: Tile[], players: ActivePlayer[]) {
	const currentPlayer = findCurrentPlayer(players);
	if (!currentPlayer) {
		throw new Error('No player has the turn');
	}
	const currentTile = board.find(
		(tile) => tile.id === currentPlayer.currentTileId,
	);
	if (!currentTile) {
		throw new Error('Player is on no Tile');
	}
	if (!currentTile.info) {
		throw new Error('Tile is not valid');
	}
	return { currentPlayer, currentTileInfo: currentTile.info }
}