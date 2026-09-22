import { items, type Item } from "../data/items";

const itemTypes: Item[] = [
  "Sand Remover",
  "Flying Tool",
  "Thirst Shield",
  "X-Ray Goggles",
  "Add 2 Water",
  "Speed Boost",
];

export default function ItemDeck({
  discardedItems,
}: {
  discardedItems: Partial<Record<Item, number>>;
}) {
  const discardedItemsCount = itemTypes.reduce(
    (total, itemType) => total + (discardedItems[itemType] ?? 0),
    0,
  );
  const itemsLeftToDraw = items.length - discardedItemsCount;

  return (
    <section className="w-full max-w-xl space-y-5 rounded-xl border border-white/15 bg-white/5 p-5 shadow-2xl shadow-black/30">
      <header className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">
            Item deck
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Draw progress
          </h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white tabular-nums">
            {itemsLeftToDraw}
            <span className="text-base font-normal text-white/45">
              {" "}
              / {items.length}
            </span>
          </p>
          <p className="text-xs tracking-wider text-white/50 uppercase">
            cards left
          </p>
        </div>
      </header>

      <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-4">
        <p className="text-sm text-amber-100/70">Discard pile</p>
        <p className="mt-1 text-2xl font-semibold text-amber-100 tabular-nums">
          {discardedItemsCount}
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold tracking-[0.16em] text-white/80 uppercase">
          Discarded item cards
        </h3>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="flex items-center justify-between bg-white/10 px-3 py-2 text-xs font-semibold tracking-wider text-white/55 uppercase">
            <span>Item</span>
            <span>Discarded</span>
          </div>
          <div className="divide-y divide-white/10">
            {itemTypes.map((itemType) => (
              <div
                key={itemType}
                className="flex items-center justify-between gap-4 px-3 py-3"
              >
                <span className="text-sm font-medium text-white/80">
                  {itemType}
                </span>
                <span className="text-white tabular-nums">
                  {discardedItems[itemType] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
