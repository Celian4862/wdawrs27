export default function PawnCircle({ color }: { color: string }) {
	return (
		<div
			className="size-2 rounded-full border-2 border-white/70 shadow-md md:size-4"
			style={{
				backgroundColor: color,
			}}
			title={`Player ${color}`} // Optional browser tooltip on hover
		/>
	);
}
