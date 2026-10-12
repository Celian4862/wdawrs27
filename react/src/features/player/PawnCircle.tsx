export default function PawnCircle({
	color,
	isCurrentPlayer,
	className,
}: {
	color: string;
	isCurrentPlayer: boolean;
	className?: string;
}) {
	return (
		<div
			className={`size-2 rounded-full border-white/90 shadow-md md:size-4 ${isCurrentPlayer ? 'border-2 md:border-4' : 'border-1 md:border-2'} ${className ?? ''}`}
			style={{
				backgroundColor: color,
			}}
			title={`Player ${color}`} // Optional browser tooltip on hover
		/>
	);
}
