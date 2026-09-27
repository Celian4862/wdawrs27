import { tiles } from '../data/tiles';
import Tile from './Tile';

export default function Board() {
	return (
		<div className="grid w-fit grid-cols-5 gap-4">
			{tiles.map((tile) => {
				if (!tile) {
					throw new Error('Tile is null');
				}
				return <Tile key={tile.id} disabled={tile === null} />;
			})}
		</div>
	);
}
