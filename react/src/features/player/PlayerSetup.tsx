import { startingPosition } from '../board/tiles';
import { type ActivePlayer, assignPlayers, playerCounts } from './player-cards';

interface PlayerSetupProps {
	onSelectPlayers: (players: ActivePlayer[]) => void;
}

export default function PlayerSetup({ onSelectPlayers }: PlayerSetupProps) {
	return (
		<div className="flex min-h-screen items-center justify-center p-6">
			<div className="w-full max-w-sm text-center">
				<p className="text-xl font-semibold text-white">How many players?</p>
				<div className="mt-6 grid grid-cols-2 gap-3">
					{playerCounts.map((count) => (
						<button
							key={count}
							type="button"
							onClick={() =>
								onSelectPlayers(assignPlayers(count, startingPosition))
							}
							className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-lg font-semibold text-cyan-100 transition hover:bg-cyan-300/20 focus:outline-2 focus:outline-offset-2 focus:outline-cyan-300"
						>
							{count}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
