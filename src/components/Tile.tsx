import { hurricane } from "../magic-strings";

export function Tile({ value }: { value: string }) {
  return (
    <>
      {value === hurricane ? (
        <div className="border text-center">{value}</div>
      ) : (
        <button className="border size-20">{value}</button>
      )}
    </>
  );
}
