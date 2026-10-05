import PopUp from './PopUp';

export default function EndGameScreen(props: { endGameState: EndGameState }) {
	return (
		<PopUp
			className={
				props.endGameState.status
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'
			}
		>
			<h3 className="text-2xl font-bold">{props.endGameState.status}</h3>
			<p className="text-slate-300">{props.endGameState.reason}</p>
		</PopUp>
	);
}

export interface EndGameState {
	status?: string;
	reason?: string;
}
