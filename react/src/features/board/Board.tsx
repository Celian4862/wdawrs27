import type { ActivePlayer } from '../player/player-cards';
import Tile from './Tile';
import { tiles } from './tiles';

export default function Board(props: { players: ActivePlayer[] }) {
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
						excavated={false}
						playersOnTile={playersOnThisTile}
						onClick={() => console.log(`Clicked tile ${tile.id}`)}
					/>
				);
			})}
		</div>
	);
}
