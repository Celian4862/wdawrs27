import { useGame } from '@/components/GameContext';

export default function ResetButton() {
	const { state, dispatch } = useGame();

	return (
		<button
			type="button"
			onClick={() =>
				dispatch({ type: 'SET_SHOW_RESET_MODAL', show: true })
			}
			className={`p-3 bg-red-700 text-xl text-center rounded-lg motion-safe:transition ${state.showResetModal ? 'brightness-50 cursor-not-allowed' : 'hover:brightness-150 active:brightness-50'}`}
		>
			Reset Game
		</button>
	);
}
