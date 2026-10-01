import type { ActivePlayer } from '../../player/player-cards';
import { useTiles } from '../customHooks/useTiles';
import Tile from './Tile';

export default function Board(props: { players: ActivePlayer[] }) {
	const { tiles, handleTileClick } = useTiles();

	return (
		<div className="grid w-fit grid-cols-5 gap-4">
			{tiles.map((tile) => {
				const playersOnThisTile = props.players
					.filter((player) => player.currentTileId === tile.id)
					.map((player) => player.role.color);
				return (
					<Tile
						key={tile.id}
						disabled={!tile.info}
						revealed={tile.info?.revealed ?? false}
						playersOnTile={playersOnThisTile}
						onClick={() => handleTileClick(tile.id)}
					/>
				);
			})}
		</div>
	);
}
