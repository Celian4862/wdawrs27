import { useGame } from '@/components/GameContext';

export default function ResetButton() {
	const { dispatch } = useGame();

	return (
		<button
			type="button"
			onClick={() =>
				dispatch({ type: 'SET_SHOW_CONFIRM_RESET_MODAL', show: true })
			}
			className="p-3 bg-red-700 text-xl text-center rounded-lg hover:brightness-150 active:brightness-50 motion-safe:transition"
		>
			Reset Game
		</button>
	);
}
