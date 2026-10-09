import { getTilePlayer } from '@/data/actions';
import { useGame } from '../GameContext';
import GameInfoHeading from '../game-info/GameInfoHeading';
import GameInfoSection from '../game-info/GameInfoSection';

export default function ActionPanel() {
	const { state, dispatch } = useGame();
	const { currentPlayer, currentTileInfo } = getTilePlayer(
		state.board,
		state.players,
	);

	const actions = [
		{
			name: 'Move',
			disableCondition:
				currentTileInfo.sandPoints > 1 &&
				state.players.find((player) => player.role.title === 'Hiker')
					?.currentTileId !== currentPlayer.currentTileId,
			get onClick() {
				return () => {
					if (state.isDrawingHurricaneCards) {
						return;
					}
					dispatch({ type: 'SELECT_ACTION', action: this.name });
				};
			},
		},
		{
			name: 'Remove Sand',
			disableCondition: currentTileInfo.sandPoints === 0,
			get onClick() {
				return () => {
					if (state.isDrawingHurricaneCards) {
						return;
					}
					dispatch({ type: 'SELECT_ACTION', action: this.name });
				};
			},
		},
		{
			name: 'Collect Part',
			disableCondition:
				currentTileInfo.partCount === 0 || !currentTileInfo.revealed,
			get onClick() {
				return () => {
					if (state.isDrawingHurricaneCards) {
						return;
					}
					dispatch({ type: 'SELECT_ACTION', action: this.name });
				};
			},
		},
		{
			name: 'Reveal Tile',
			disableCondition:
				currentTileInfo.sandPoints > 0 || currentTileInfo.revealed,
			get onClick() {
				return () => {
					if (state.isDrawingHurricaneCards) {
						return;
					}
					dispatch({ type: 'SELECT_ACTION', action: this.name });
					dispatch({ type: 'SET_SHOW_REVEAL_MODAL', show: true });
				};
			},
		},
		{
			name: 'Cancel',
			disableCondition: !state.selectedAction,
			get onClick() {
				return () => {
					if (state.isDrawingHurricaneCards) {
						return;
					}
					dispatch({ type: 'SELECT_ACTION', action: null });
				};
			},
		},
	];

	return (
		<GameInfoSection className="bg-slate-700 lg:sticky top-0 lg:z-30">
			<GameInfoHeading heading="Action Panel" subheading="" />
			<div className="flex flex-wrap gap-2">
				{actions.map((action) => (
					<button
						key={action.name}
						type="button"
						disabled={action.disableCondition || state.isDrawingHurricaneCards}
						onClick={action.onClick}
						className={`p-3 border rounded-lg motion-safe:transition ${action.disableCondition || state.isDrawingHurricaneCards ? 'brightness-50' : 'hover:bg-yellow-600 active:scale-115'} ${state.selectedAction === action.name ? 'bg-yellow-600 scale-115' : ''}`}
					>
						{action.name}
					</button>
				))}
			</div>
		</GameInfoSection>
	);
}
