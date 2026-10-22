import { useGame } from '@/utility/GameContext';

export default function ResetButton() {
	const { state, dispatch } = useGame();

	return (
		<button
			type="button"
			onClick={() => dispatch({ type: 'SET_SHOW_RESET_MODAL', show: true })}
			className={`rounded-lg bg-red-700 p-3 text-center text-xl motion-safe:transition ${state.showResetModal ? 'cursor-not-allowed brightness-50' : 'hover:brightness-150 active:brightness-50'}`}
		>
			Reset Game
		</button>
	);
}
