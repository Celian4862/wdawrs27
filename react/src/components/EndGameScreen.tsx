import { useGame } from './GameContext';
import PopUp from './PopUp';

export default function EndGameScreen() {
	const { state } = useGame();

	return (
		<PopUp
			show={!!state.endGameState.status}
			heading={state.endGameState.status ?? ''}
			description={state.endGameState.reason}
		/>
	);
}

export interface EndGameState {
	status?: string;
	reason?: string;
}
