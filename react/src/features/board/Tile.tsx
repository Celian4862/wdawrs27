import PawnCircle from './PawnCircle';

const hurricane = '🌪';

export default function Tile(props: {
	disabled: boolean;
	excavated: boolean;
	playersOnTile: string[];
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			disabled={props.disabled}
			className={`relative size-20 border border-slate-600 rounded-md flex flex-col items-center justify-center transition-colors ${
				props.excavated
					? 'bg-yellow-600/80 text-white'
					: 'bg-slate-800 text-white/70'
			} ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'}`}
			onClick={props.onClick}
		>
			{props.disabled && <span className="text-lg">{hurricane}</span>}
			{props.playersOnTile.length > 0 && (
				<div className="absolute inset-0 p-1 flex items-start justify-end gap-0.5 pointer-events-none">
					{props.playersOnTile.map((playerColor) => (
						<PawnCircle key={playerColor} color={playerColor} />
					))}
				</div>
			)}
		</button>
	);
}
