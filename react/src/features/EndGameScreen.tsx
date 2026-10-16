import ConfirmModalButtons from './utility/ConfirmModalButtons';
import { useGame } from './utility/GameContext';
import PopUp from './utility/PopUp';

export default function EndGameScreen() {
	const { state, dispatch } = useGame();
	const victory =
		state.endGameState.status === 'Victory'
			? true
			: state.endGameState.status === 'Defeat'
				? false
				: undefined;

	return (
		<PopUp
			show={!!state.endGameState.status}
			heading={state.endGameState.status ?? ''}
			description={state.endGameState.reason}
			victory={victory}
		>
			<ConfirmModalButtons
				confirmMessage="New Game"
				onConfirm={() => dispatch({ type: 'RESET_GAME' })}
				victory={victory}
				className="bg-green-600 hover:bg-green-500 active:bg-green-700"
			/>
		</PopUp>
	);
}

export interface EndGameState {
	status?: string;
	reason?: string;
}
