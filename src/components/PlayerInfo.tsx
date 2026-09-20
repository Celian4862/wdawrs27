import type { PlayerType } from "../data/player-cards";

export default function PlayerInfo({ players }: { players: PlayerType[] }) {
  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2">
      {players.map((player) => (
        <article
          key={player.title}
          className="rounded-xl border border-white/15 bg-white/5 p-4"
        >
          <h2 className="text-xl font-bold text-white">{player.title}</h2>
          <h3 className="mt-1 text-sm font-medium text-white/65">
            {player.ability}
          </h3>
          <p className="mt-4 text-lg font-semibold text-cyan-200 tabular-nums">
            {player.currentWaterLevel}/{player.waterLevel}
          </p>
          <ul className="mt-3 space-y-1 text-sm text-white/80">
            {player.items.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
