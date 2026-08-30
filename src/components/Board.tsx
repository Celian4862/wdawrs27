import type { TileInfo } from "../types/TileInfo";
import { Tile } from "./Tile";

export function Board({ board }: { board: TileInfo[] }) {
  return (
    <div className="grid grid-cols-5 w-fit">
      {board.map((_, i) => (
        <Tile key={i} value={board[i].tile_type} />
      ))}
    </div>
  );
}
