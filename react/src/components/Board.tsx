import { useGame } from '@/components/GameContext';
import PawnCircle from './player/PawnCircle';

export default function Board({ className }: { className?: string }) {
	const { state } = useGame();

	return (
		<section
			className={`overflow-x-auto [-webkit-overflow-scrolling:touch] ${className ?? ''}`}
		>
			<div className="min-w-115 lg:fixed w-fit grid grid-cols-5 gap-5">
				{state.board.map((tile) => {
					console.log(tile);
					return (
						<button
							key={tile.id}
							type="button"
							disabled={!tile.info}
							className={`relative border rounded-lg size-20 ease-in-out hover:duration-250 active:duration-100 motion-safe:transition-all ${!tile.info ? 'brightness-50 cursor-not-allowed' : 'hover:scale-125 active:brightness-50'}`}
						>
							{!tile.info && '🌪'}
							{tile.info && tile.info.sandPoints > 0 && (
								<span
									className={`absolute left-1 top-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-slate-950 ${tile.info.sandPoints > 1 ? 'bg-orange-600' : 'bg-amber-500/90'}`}
								>
									{tile.info.sandPoints}
								</span>
							)}

							{tile.info && (
								<span className="absolute bottom-1 left-1 text-lg leading-none">
									{tile.info.revealed
										? tile.info.revealedTileEmoji
										: tile.info.unrevealedTileEmoji}
								</span>
							)}

							<div className="absolute right-1 top-1 grid grid-rows-3 grid-flow-col rtl gap-0.5 items-start pointer-events-none">
								{state.players
									.filter((player) => player.currentTileId === tile.id)
									.map((player) => (
										<PawnCircle
											key={player.role.color}
											color={player.role.color}
										/>
									))}
							</div>
						</button>
					);
				})}
			</div>
		</section>
	);
}
