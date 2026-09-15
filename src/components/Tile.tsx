const hurricane = "🌪";

export default function Tile({ disabled }: { disabled: boolean }) {
  return (
    <button type="button" disabled={disabled} className="size-20 border">
      {disabled && hurricane}
    </button>
  );
}
