import Tile from './Tile';
import { tiles } from './tiles';

export default function Board() {
	return (
		<div className="grid w-fit grid-cols-5 gap-4">
			{tiles.map((tile) => {
				return <Tile key={tile.id} disabled={!tile.info} />;
			})}
		</div>
	);
}
