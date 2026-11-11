import { Fragment } from "react/jsx-runtime";
import type { Board as BoardType } from "#/server/features/board/types";
import type { PlayerState } from "#/server/features/player/types";

export default function Board({
	board,
	className = "",
}: {
	board: BoardType;
	selectedAction: string | null;
	players: PlayerState;
	className?: string;
}) {
	return (
		<section
			className={`box-border grid aspect-square w-100 grid-cols-5 gap-2 md:max-w-full lg:h-full lg:w-auto ${className}`}
		>
			{board.map((tile) => (
				<Fragment key={tile.id}>
					{tile.id === 12 ? (
						<div />
					) : (
						<button type="button">
							{/* Sand Counter Badge */}
							{tile.sandPoints > 0 && (
								<span
									className={`absolute -top-1 -right-1 rounded-full border px-1.5 py-0.5 text-[8px] font-bold text-slate-950 lg:top-1 lg:right-1 ${tile.sandPoints > 1 ? "bg-orange-600" : "bg-amber-500/90"} md:text-[10px] xl:px-2 xl:text-base`}
								>
									{tile.sandPoints}
								</span>
							)}

							{/* Players on Tile */}
							<div className="rtl pointer-events-none absolute top-1 left-1 grid grid-flow-col grid-rows-2 items-start gap-0.5">
								{/* {players
									.filter((player) => player.currentTileId === tile.id)
									.map((player) => {
										const isCurrentPlayer = false;
										return (
											<PawnCircle
												key={player.roleKey}
												color={player.roleKey}
												isCurrentPlayer={isCurrentPlayer}
												className={
													isCurrentPlayer ? "motion-safe:animate-bounce" : ""
												}
											/>
										);
									})} */}
							</div>

							{/* Parts on Tile */}
							{tile.parts.length > 0 && (
								<div className="ltr pointer-events-none absolute bottom-1 left-1 grid grid-flow-col grid-rows-2 items-start gap-0.5">
									{[...tile.parts].map((part) => (
										<span key={part} className="bg-black text-xs">
											{part}
										</span>
									))}
								</div>
							)}
						</button>
					)}
				</Fragment>
			))}
		</section>
	);
}
