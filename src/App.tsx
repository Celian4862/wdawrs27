import { Board } from "./components/Board";
import { hurricane } from "./magic-strings";
import type { TileInfo } from "./types/TileInfo";

export default function App() {
  const board: TileInfo[] = Array.from({ length: 25 }, (_, i) => ({
    tile_number: i,
    tile_type: "",
  }));
  board[12].tile_type = hurricane;
  return <Board board={board} />;
}
