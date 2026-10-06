import ConfirmModalButtons from './ConfirmModalButtons';
import { useGame } from './GameContext';
import PopUp from './PopUp';

export default function EndGameScreen() {
	const { state, dispatch } = useGame();

	return (
		<PopUp
			show={!!state.endGameState.status}
			heading={state.endGameState.status ?? ''}
			description={state.endGameState.reason}
			defeat={true}
		>
			<ConfirmModalButtons
				confirmMessage="New Game"
				onConfirm={() => dispatch({ type: 'RESET_GAME' })}
				defeat={true}
			/>
		</PopUp>
	);
}

export interface EndGameState {
	status?: string;
	reason?: string;
}
