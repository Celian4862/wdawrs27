import ConfirmModalButtons from './ConfirmModalButtons';
import { useGame } from './GameContext';
import PopUp from './PopUp';

export default function ResetButtonModal() {
	const { state, dispatch } = useGame();

	return (
		<PopUp show={state.showConfirmResetModal} heading="Reset game?" description="This will destroy all progress made during this session.">
			<ConfirmModalButtons
				confirmMessage="Confirm & Reset"
				onCancel={() =>
					dispatch({ type: 'SET_SHOW_CONFIRM_RESET_MODAL', show: false })
				}
				onConfirm={() => dispatch({ type: 'RESET_GAME' })}
			/>
		</PopUp>
	);
}
