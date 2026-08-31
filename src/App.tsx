type TileInfo = {
  id: number;
  revealed: boolean;
  tile_type: string;
};

const hurricane = "🌪";

export default function App() {
  const board: TileInfo[] = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    revealed: false,
    tile_type: "",
  }));
  board[12].tile_type = hurricane;
  return (
    <div className="gap-4 grid grid-cols-5 w-fit">
      {board.map((tile, i) => (
        <button
          key={i}
          type="button"
          disabled={tile.id === 12}
          className="border size-20"
        >
          {tile.tile_type}
        </button>
      ))}
    </div>
  );
}
