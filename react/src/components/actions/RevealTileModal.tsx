import { getTilePlayer } from "@/data/actions";
import ConfirmModalButtons from "../ConfirmModalButtons";
import { useGame } from "../GameContext";
import PopUp from "../PopUp";

export default function RevealTileModal() {
	const { state, dispatch } = useGame();

	const { currentPlayer } = getTilePlayer(state.board, state.players);

	return (
		<PopUp
			show={state.showRevealModal}
			heading={`Reveal ${currentPlayer.role.title}'s tile?`}
			description="This action cannot be undone."
		>
			<ConfirmModalButtons
				confirmMessage="Confirm & Reveal"
				onCancel={() => {
						dispatch({ type: 'SET_SHOW_REVEAL_MODAL', show: false });
						dispatch({ type: 'SELECT_ACTION', action: null})
					}
				}
				onConfirm={() => {
					dispatch({ type: 'SET_SHOW_REVEAL_MODAL', show: false })
					dispatch({ type: 'SELECT_ACTION', action: null })
					dispatch({ type: 'REVEAL_TILE', tile: currentPlayer.currentTileId })
				}}
			/>
		</PopUp>
	);
}
