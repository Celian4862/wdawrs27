import { tiles } from "../data/tiles";
import Tile from "./Tile";

export default function Board() {
  return (
    <div className="grid w-fit grid-cols-5 gap-4">
      {tiles.map((tile, i) => (
        <Tile key={i} disabled={tile === null} />
      ))}
    </div>
  );
}
