import type { RoleKey } from "#/server/features/player/types";

const roleColors: Record<RoleKey, string> = {
	digger: "bg-[#ef4444]",
	hiker: "bg-black",
	traveler: "bg-[#0b7f59]",
	cartographer: "bg-[#f59e0b]",
	weatherForecaster: "bg-[#b1b1b1]",
	waterDispenser: "bg-[#06b6d4]",
};

export default function PawnCircle({
	roleKey,
	isCurrentPlayer,
	className = "",
}: {
	roleKey: RoleKey;
	isCurrentPlayer: boolean;
	className?: string;
}) {
	return (
		<div
			className={`size-2 rounded-full border-white/90 shadow-md md:size-3 xl:size-4 ${isCurrentPlayer ? "border-2 lg:border-3 xl:border-4" : "border-1 xl:border-2"} ${roleColors[roleKey]} ${className}`}
			title={`Player ${roleKey}`} // Optional browser tooltip on hover
		/>
	);
}
