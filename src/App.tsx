import { tiles } from "./data/tiles";

const hurricane = "🌪";

export default function App() {
  return (
    <div className="gap-4 grid grid-cols-5 w-fit">
      {tiles.map((tile, i) => (
        <button
          key={i}
          type="button"
          disabled={tile === null}
          className="border size-20"
        >
          {tile === null && hurricane}
        </button>
      ))}
    </div>
  );
}
