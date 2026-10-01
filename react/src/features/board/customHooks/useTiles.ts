import { useState } from 'react';
import { tiles as TILES } from '../tiles';

export function useTiles() {
	const [tiles, setTiles] = useState(TILES);

	const handleTileClick = (tileId: number) => {
		setTiles((prevTiles) =>
			prevTiles.map((tile) => {
				if (tile.id === tileId && tile.info) {
					return {
						...tile,
						info: {
							...tile.info,
							revealed: true,
						},
					};
				}
				return tile;
			}),
		);
	};

	return {
		tiles,
		handleTileClick,
	};
}
