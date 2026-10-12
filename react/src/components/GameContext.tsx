import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';
import type { EndGameState } from '@/components/EndGameScreen';
import { getTileIndex } from '@/data/actions';
import {
	type HurricaneCard,
	shuffleHurricaneDeck,
} from '@/data/hurricane/hurricaneDeck';
import { initHurricaneMeter } from '@/data/hurricane/initHurricaneMeter';
import { type ItemType, shuffleItemDeck } from '@/data/items';
import { type ActivePlayer, assignPlayers } from '@/data/players';
import {
	findNeighboring,
	findSandPoints,
	shuffleBoard,
	type Tile,
} from '@/data/tiles';

interface GameState {
	gameId: boolean;
	players: ActivePlayer[];
	firstPlayerId: number;
	board: Tile[];
	selectedAction: string | null;
	prevAction: string | null;
	actionCount: number;
	showRevealModal: boolean;
	hurricaneMeter: number[];
	meterProgress: number;
	hurricaneDeck: HurricaneCard[];
	recentlyDrawnHurricaneCard: HurricaneCard;
	isDrawingHurricaneCards: boolean;
	showEndTurnModal: boolean;
	turnStatus: string | null;
	turnCount: number;
	itemDeck: ItemType[];
	recentlyDrawnItemCard: string;
	partsCollected: string[];
	endGameState: EndGameState;
	showResetModal: boolean;
}

const initialState: GameState = {
	gameId: false,
	players: [],
	firstPlayerId: -1,
	board: shuffleBoard(),
	actionCount: 4,
	selectedAction: null,
	prevAction: null,
	showRevealModal: false,
	hurricaneMeter: [],
	meterProgress: -1,
	hurricaneDeck: shuffleHurricaneDeck(),
	recentlyDrawnHurricaneCard: { type: 'None' },
	isDrawingHurricaneCards: false,
	showEndTurnModal: false,
	turnStatus: null,
	turnCount: 1,
	itemDeck: shuffleItemDeck(),
	recentlyDrawnItemCard: 'None',
	partsCollected: [],
	endGameState: {},
	showResetModal: false,
};

type GameAction =
	| { type: 'SET_PLAYERS'; count: number }
	| { type: 'SET_DIFFICULTY'; index: number }
	| { type: 'SELECT_ACTION'; action: string | null }
	| { type: 'MOVE_TILES'; players: ActivePlayer[] }
	| { type: 'REMOVE_SAND'; tilePosition: number }
	| { type: 'GAIN_WATER'; players: ActivePlayer[] }
	| { type: 'SET_SHOW_REVEAL_MODAL'; prevAction: string | null; show: boolean }
	| { type: 'REVEAL_TILE'; board: Tile[]; players: ActivePlayer[] }
	| { type: 'SET_SHOW_END_TURN_MODAL'; show: boolean }
	| { type: 'START_DRAWING' }
	| { type: 'FINISH_DRAWING' }
	| {
			type: 'SET_TURN_STATUS';
			players: ActivePlayer[];
			status: string | null;
			turnCount: number;
	  }
	| { type: 'MOVE_HURRICANE'; board: Tile[] }
	| { type: 'DRINK_WATER'; players: ActivePlayer[] }
	| { type: 'DRAW_HURRICANE_CARD'; deck: HurricaneCard[]; card: HurricaneCard }
	| { type: 'RESHUFFLE_DECK'; deck: HurricaneCard[] }
	| { type: 'DRAW_ITEM_CARD'; items: ItemType[]; card: string }
	| { type: 'GAME_OVER'; reason: string }
	| { type: 'SET_SHOW_RESET_MODAL'; show: boolean }
	| { type: 'RESET_GAME' };

function gameReducer(state: GameState, action: GameAction): GameState {
	const actionCount = state.actionCount - 1;
	const selectedAction = actionCount === 0 ? null : state.selectedAction;

	switch (action.type) {
		case 'SET_PLAYERS': {
			const players = assignPlayers(action.count);
			return {
				...state,
				players,
				firstPlayerId: players[0].id,
				hurricaneMeter: initHurricaneMeter(action.count),
			};
		}
		case 'SET_DIFFICULTY':
			return { ...state, meterProgress: action.index };
		case 'SELECT_ACTION':
			return { ...state, selectedAction: action.action };
		case 'MOVE_TILES':
			if (state.actionCount === 0) {
				return state;
			}
			return {
				...state,
				actionCount,
				selectedAction,
				players: action.players,
			};
		case 'REMOVE_SAND': {
			if (state.actionCount === 0) {
				return state;
			}
			const newBoard = [...state.board];
			const targetTile = newBoard[action.tilePosition];
			const currentTileIndex = getTileIndex(state.board, state.players[0]);

			if (targetTile.info) {
				newBoard[action.tilePosition] = {
					id: targetTile.id,
					info: {
						...targetTile.info,
						sandPoints:
							state.players[0].role.title === 'Digger'
								? targetTile.info.sandPoints - 2
								: targetTile.info.sandPoints - 1,
					},
				};
				return {
					...state,
					actionCount,
					selectedAction:
						findSandPoints(
							newBoard,
							currentTileIndex,
							findNeighboring(
								newBoard,
								currentTileIndex,
								state.players[0].role.title,
							),
						).length === 0
							? null
							: selectedAction,
					board: newBoard,
				};
			} else {
				return { ...state };
			}
		}
		case 'SET_SHOW_REVEAL_MODAL':
			return {
				...state,
				prevAction: action.prevAction,
				showRevealModal: action.show,
			};
		case 'REVEAL_TILE': {
			return {
				...state,
				players: action.players,
				actionCount: state.actionCount - 1,
				board: action.board,
			};
		}
		case 'SET_SHOW_END_TURN_MODAL':
			return { ...state, showEndTurnModal: action.show };
		case 'SET_SHOW_RESET_MODAL':
			return {
				...state,
				showResetModal: action.show,
			};
		case 'START_DRAWING':
			return {
				...state,
				showEndTurnModal: false,
				isDrawingHurricaneCards: true,
				turnStatus: 'Drawing cards...',
			};
		case 'FINISH_DRAWING':
			return { ...state, isDrawingHurricaneCards: false, turnStatus: null };
		case 'SET_TURN_STATUS':
			return {
				...state,
				actionCount: 4,
				players: action.players,
				turnStatus: action.status,
				turnCount: action.turnCount,
			};
		case 'MOVE_HURRICANE': {
			return {
				...state,
				board: action.board,
			};
		}
		case 'DRINK_WATER': {
			return {
				...state,
				players: action.players,
			};
		}
		case 'DRAW_HURRICANE_CARD': {
			return {
				...state,
				selectedAction: null,
				hurricaneDeck: action.deck,
				recentlyDrawnHurricaneCard: action.card,
				meterProgress:
					action.card.type === 'Hurricane Up'
						? state.meterProgress + 1
						: state.meterProgress,
			};
		}
		case 'RESHUFFLE_DECK': {
			return {
				...state,
				hurricaneDeck: action.deck,
			};
		}
		case 'DRAW_ITEM_CARD': {
			if (state.itemDeck.length === 0) {
				return state;
			}
			return {
				...state,
				recentlyDrawnItemCard: action.card,
				itemDeck: action.items,
			};
		}
		case 'GAME_OVER':
			return {
				...state,
				endGameState: { status: 'Defeat', reason: action.reason },
			};
		case 'RESET_GAME':
			return {
				...initialState,
				gameId: !state.gameId,
				board: shuffleBoard(),
				hurricaneDeck: shuffleHurricaneDeck(),
				itemDeck: shuffleItemDeck(),
			};
		default:
			return state;
	}
}

const GameContext = createContext<{
	state: GameState;
	dispatch: React.Dispatch<GameAction>;
	getGameState: () => GameState;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(gameReducer, initialState);
	const stateRef = useRef(state);

	useEffect(() => {
		stateRef.current = state;
	}, [state]);

	const getGameState = () => stateRef.current;

	return (
		<GameContext.Provider value={{ state, dispatch, getGameState }}>
			{children}
		</GameContext.Provider>
	);
}

export function useGame() {
	const context = useContext(GameContext);
	if (!context) throw new Error('useGame must be used within GameProvider');
	return context;
}
