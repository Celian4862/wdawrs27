import ConfirmModalButtons from '@/features/utility/ConfirmModalButtons';
import { useGame } from '@/features/utility/GameContext';
import PopUp from '@/features/utility/PopUp';

export default function ResetButtonModal() {
	const { state, dispatch } = useGame();

	return (
		<PopUp
			show={state.showResetModal}
			heading="Reset game?"
			description="This will destroy all progress made during this session."
		>
			<ConfirmModalButtons
				confirmMessage="Confirm & Reset"
				onCancel={() => dispatch({ type: 'SET_SHOW_RESET_MODAL', show: false })}
				onConfirm={() => dispatch({ type: 'RESET_GAME' })}
			/>
		</PopUp>
	);
}
