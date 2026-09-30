import { useState } from 'react';
import type { ActivePlayer } from '../player/player-cards';
import Tile from './Tile';
import { tiles as TILES } from './tiles';

export default function Board(props: { players: ActivePlayer[] }) {
	const [tiles, setTiles] = useState(TILES);

	const handleExcavate = (tileId: number) => {
		setTiles((prevTiles) =>
			prevTiles.map((tile) => {
				// Check if this is the right tile AND it actually has info
				if (tile.id === tileId && tile.info) {
					return {
						...tile,
						info: {
							...tile.info,
							revealed: true, // Flip revealed to true
						},
					};
				}
				return tile;
			}),
		);
	};

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
						onClick={() => handleExcavate(tile.id)}
					/>
				);
			})}
		</div>
	);
}
