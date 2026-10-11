export default function PawnCircle({
	color,
	isCurrentPlayer,
}: {
	color: string;
	isCurrentPlayer: boolean;
}) {
	return (
		<div
			className={`size-2 rounded-full border-white/90 shadow-md md:size-4 ${isCurrentPlayer ? 'border-4 motion-safe:animate-bounce' : 'border-2'}`}
			style={{
				backgroundColor: color,
			}}
			title={`Player ${color}`} // Optional browser tooltip on hover
		/>
	);
}
