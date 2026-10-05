import { useGame } from './GameContext';
import PopUp from './PopUp';

export default function EndGameScreen() {
	const { state } = useGame();

	return (
		<PopUp
			className={
				state.endGameState.status
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'
			}
		>
			<h3 className="text-2xl font-bold">{state.endGameState.status}</h3>
			<p className="text-slate-300">{state.endGameState.reason}</p>
		</PopUp>
	);
}

export interface EndGameState {
	status?: string;
	reason?: string;
}
