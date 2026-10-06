export default function PawnCircle({ color }: { color: string }) {
	return (
		<div
			className="w-4 h-4 rounded-full border-2 border-white/70 shadow-md"
			style={{
				backgroundColor: color,
			}}
			title={`Player ${color}`} // Optional browser tooltip on hover
		/>
	);
}
