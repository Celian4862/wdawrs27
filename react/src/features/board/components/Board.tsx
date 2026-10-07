import type { ActivePlayer } from '../../player/player-cards';
import type { TileType } from '../tileTypes';
import Tile from './Tile';

export default function Board(props: {
	players: ActivePlayer[];
	tiles: TileType[];
	handleTileClick: (tileId: number) => void;
}) {
	return (
		<div className="grid w-fit grid-cols-5 gap-4">
			{props.tiles.map((tile) => {
				const playersOnThisTile = props.players
					.filter((player) => player.currentTileId === tile.id)
					.map((player) => player.role.color);
				return (
					<Tile
						key={tile.id}
						disabled={!tile.info}
						revealed={tile.info?.revealed ?? false}
						tileInfo={tile.info}
						sandPoints={tile.sandPoints}
						playersOnTile={playersOnThisTile}
						onClick={() => props.handleTileClick(tile.id)}
					/>
				);
			})}
		</div>
	);
}
