export default function HurricaneDeck({
  drawnCardsCount,
  thirstCardsCount,
  hurricaneUpCardsCount,
  moveOneUpCardsCount,
  moveOneDownCardsCount,
  moveOneLeftCardsCount,
  moveOneRightCardsCount,
  moveTwoUpCardsCount,
  moveTwoDownCardsCount,
  moveTwoLeftCardsCount,
  moveTwoRightCardsCount,
  moveThreeUpCardsCount,
  moveThreeDownCardsCount,
  moveThreeLeftCardsCount,
  moveThreeRightCardsCount,
}: {
  drawnCardsCount: number;
  thirstCardsCount: number;
  hurricaneUpCardsCount: number;
  moveOneUpCardsCount: number;
  moveOneDownCardsCount: number;
  moveOneLeftCardsCount: number;
  moveOneRightCardsCount: number;
  moveTwoUpCardsCount: number;
  moveTwoDownCardsCount: number;
  moveTwoLeftCardsCount: number;
  moveTwoRightCardsCount: number;
  moveThreeUpCardsCount: number;
  moveThreeDownCardsCount: number;
  moveThreeLeftCardsCount: number;
  moveThreeRightCardsCount: number;
}) {
  return (
    <section className="mb-5 w-full max-w-xl space-y-5 rounded-xl border border-white/15 bg-white/5 p-5 shadow-2xl shadow-black/30">
      <header className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">
            Hurricane deck
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Draw progress
          </h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white tabular-nums">
            {drawnCardsCount}
            <span className="text-base font-normal text-white/45"> / 31</span>
          </p>
          <p className="text-xs tracking-wider text-white/50 uppercase">
            cards drawn
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-4">
          <p className="text-sm text-amber-100/70">Thirst</p>
          <p className="mt-1 text-2xl font-semibold text-amber-100 tabular-nums">
            {thirstCardsCount}
          </p>
        </div>
        <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
          <p className="text-sm text-cyan-100/70">Hurricane Up</p>
          <p className="mt-1 text-2xl font-semibold text-cyan-100 tabular-nums">
            {hurricaneUpCardsCount}
          </p>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-[0.16em] text-white/80 uppercase">
            Movement cards
          </h3>
        </div>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="grid grid-cols-[minmax(4.5rem,1.2fr)_repeat(4,minmax(0,1fr))] bg-white/10 px-2 py-2 text-center text-xs font-semibold tracking-wider text-white/55 uppercase">
            <span className="text-left">Move</span>
            <span>Up</span>
            <span>Down</span>
            <span>Left</span>
            <span>Right</span>
          </div>
          <div className="divide-y divide-white/10">
            <div className="grid grid-cols-[minmax(4.5rem,1.2fr)_repeat(4,minmax(0,1fr))] items-center px-2 py-3 text-center">
              <span className="text-left text-sm font-medium text-white/80">
                1 space
              </span>
              <span className="text-white">{moveOneUpCardsCount}</span>
              <span className="text-white">{moveOneDownCardsCount}</span>
              <span className="text-white">{moveOneLeftCardsCount}</span>
              <span className="text-white">{moveOneRightCardsCount}</span>
            </div>
            <div className="grid grid-cols-[minmax(4.5rem,1.2fr)_repeat(4,minmax(0,1fr))] items-center px-2 py-3 text-center">
              <span className="text-left text-sm font-medium text-white/80">
                2 spaces
              </span>
              <span className="text-white">{moveTwoUpCardsCount}</span>
              <span className="text-white">{moveTwoDownCardsCount}</span>
              <span className="text-white">{moveTwoLeftCardsCount}</span>
              <span className="text-white">{moveTwoRightCardsCount}</span>
            </div>
            <div className="grid grid-cols-[minmax(4.5rem,1.2fr)_repeat(4,minmax(0,1fr))] items-center px-2 py-3 text-center">
              <span className="text-left text-sm font-medium text-white/80">
                3 spaces
              </span>
              <span className="text-white">{moveThreeUpCardsCount}</span>
              <span className="text-white">{moveThreeDownCardsCount}</span>
              <span className="text-white">{moveThreeLeftCardsCount}</span>
              <span className="text-white">{moveThreeRightCardsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
