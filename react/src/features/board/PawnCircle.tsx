export default function PawnCircle(props: { color: string }) {
	return (
		<div
			className="w-4 h-4 rounded-full border-2 border-white/70 shadow-md"
			style={{
				backgroundColor: props.color,
			}}
			title={`Player ${props.color}`} // Optional browser tooltip on hover
		/>
	);
}
