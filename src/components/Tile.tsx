const hurricane = "🌪";

export default function Tile({ disabled }: { disabled: boolean }) {
    return <button
          type="button"
          disabled={disabled}
          className="border size-20"
        >
          {disabled && hurricane}
        </button>
}