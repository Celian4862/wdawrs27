import PawnCircle from './PawnCircle';

const hurricane = '🌪';

const getTileEmoji = (tileInfo?: {
	revealed: boolean;
	unrevealedType?: string;
	revealedType?: string;
}) => {
	if (!tileInfo) return null;

	if (tileInfo.unrevealedType === 'Start') return '🚩';

	if (tileInfo.revealed) {
		switch (tileInfo.revealedType) {
			case 'Water':
				return '💧';
			case 'Fake':
				return '🥀';
			case 'Exit':
				return '🏁';
			case 'Shade':
				return '🕳️';
			case 'Item':
				return '⚙️';
			case 'Hint':
				return '🏜️';
			default:
				return '🏜️';
		}
	}

	if (tileInfo.unrevealedType === 'Greenth') return '🌵';
	return '🏜️';
};

export default function Tile(props: {
	disabled: boolean;
	revealed: boolean;
	tileInfo?: {
		revealed: boolean;
		unrevealedType?: string;
		revealedType?: string;
	};
	sandMarks: number;
	playersOnTile: string[];
	onClick: () => void;
}) {
	const tileEmoji = getTileEmoji(props.tileInfo);

	return (
		<button
			type="button"
			disabled={props.disabled}
			className={`relative size-20 border border-slate-600 rounded-md flex flex-col items-center justify-center transition-colors ${
				props.revealed
					? 'bg-yellow-600/80 text-white'
					: 'bg-slate-800 text-white/70'
			} ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'}`}
			onClick={props.onClick}
		>
			{props.disabled && <span className="text-lg">{hurricane}</span>}

			{props.sandMarks > 0 && (
				<span className="absolute left-1 top-1 rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
					{props.sandMarks}
				</span>
			)}

			{tileEmoji && (
				<span className="absolute bottom-1 left-1 text-lg leading-none">
					{tileEmoji}
				</span>
			)}

			{props.playersOnTile.length > 0 && (
				<div className="absolute right-1 top-1 grid grid-rows-3 grid-flow-col rtl gap-0.5 items-start pointer-events-none">
					{props.playersOnTile.map((playerColor) => (
						<PawnCircle key={playerColor} color={playerColor} />
					))}
				</div>
			)}
		</button>
	);
}
