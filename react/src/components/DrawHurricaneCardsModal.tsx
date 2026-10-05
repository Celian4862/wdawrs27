import PopUp from './PopUp';

export default function DrawHurricaneCardsModal(props: {
	showConfirmModal: boolean;
	cardsToDrawCount: number;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	return (
		<PopUp
			className={
				props.showConfirmModal
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'
			}
		>
			<h3 className="text-2xl font-bold">End Your Turn?</h3>
			<p className="text-slate-300">
				This will automatically draw{' '}
				<strong className="text-amber-400">{props.cardsToDrawCount}</strong>{' '}
				Hurricane cards and advance to the next player.
			</p>
			<div className="pt-2 flex flex-col gap-3 justify-center md:flex-row">
				<button
					type="button"
					className="px-5 py-2 bg-red-600 hover:bg-red-700 font-bold rounded-lg transition"
					onClick={props.onConfirm}
				>
					Confirm & Draw
				</button>
				<button
					type="button"
					className="px-5 py-2 border rounded-lg hover:bg-slate-800 transition"
					onClick={props.onCancel}
				>
					Cancel
				</button>
			</div>
		</PopUp>
	);
}
