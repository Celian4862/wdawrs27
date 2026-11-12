import { Fragment } from "react/jsx-runtime";
import type {
	Board as BoardType,
	PartNames,
	PartOrientation,
	TileStatus,
} from "#/server/features/board/types";
import type { PlayerState } from "#/server/features/player/types";
import PawnCircle from "./PawnCircle";

export const tileColors: Record<TileStatus, string> = {
	Start: "bg-red-700",
	Exit: "bg-white/80",
	Item: "bg-slate-700",
	Greenth: "bg-lime-600",
	Water: "bg-blue-700",
	Fake: "bg-amber-700",
	Sand: "bg-yellow-300/80",
	Shade: "bg-black",
	Pointer: "bg-red-950",
	Motor: "bg-gray-400",
	Core: "bg-orange-500",
	Fan: "bg-yellow-600",
};

export default function Board({
	board,
	selectedAction,
	players,
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
						<button
							type="button"
							disabled={!selectedAction}
							className={`relative aspect-square rounded-lg border ease-in-out hover:duration-250 active:duration-100 motion-safe:transition-all ${tile.revealed ? tileColors[tile.revealedType] : tileColors[tile.unrevealedType]}`}
						>
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
								{players
									.filter((player) => player.tileId === tile.id)
									.map((player) => {
										const isCurrentPlayer =
											players[0].roleKey === player.roleKey;
										return (
											<PawnCircle
												key={player.roleKey}
												roleKey={player.roleKey}
												isCurrentPlayer={isCurrentPlayer}
												className={
													isCurrentPlayer ? "motion-safe:animate-bounce" : ""
												}
											/>
										);
									})}
							</div>

							{/* Parts on Tile */}
							{tile.parts.length > 0 && (
								<div className="ltr pointer-events-none absolute bottom-1 left-1 grid grid-flow-col grid-rows-2 items-start gap-0.5">
									{tile.parts.map((part) => (
										<span key={part} className="bg-black text-xs">
											{
												(
													{
														Pointer: "🧭",
														Motor: "⚡",
														Core: "💎",
														Fan: "🌀",
													} satisfies Record<PartNames, string>
												)[part]
											}
										</span>
									))}
								</div>
							)}

							{/* Orientation Emoji */}
							{tile.revealed &&
								(tile.revealedType === "Core" ||
									tile.revealedType === "Fan" ||
									tile.revealedType === "Motor" ||
									tile.revealedType === "Pointer") && (
									<span className="absolute -right-1 -bottom-0.5 text-sm leading-none md:text-lg lg:right-1 lg:bottom-1">
										{
											(
												{
													Row: "↔️",
													Col: "↕️",
												} satisfies Record<PartOrientation, string>
											)[tile.partOrientation]
										}
									</span>
								)}
						</button>
					)}
				</Fragment>
			))}
		</section>
	);
}
