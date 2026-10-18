import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';
import { shuffleBoard, type Tile } from '@/board/tiles';
import type { EndGameState } from '@/EndGameScreen';
import {
	type HurricaneCard,
	shuffleHurricaneDeck,
} from '@/hurricane/hurricane-deck/hurricaneDeck';
import { initHurricaneMeter } from '@/hurricane/hurricane-meter/initHurricaneMeter';
import { type ItemType, shuffleItemDeck } from '@/item/items';
import { type ActivePlayer, assignPlayers } from '@/player/players';

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
	| { type: 'REMOVE_SAND'; board: Tile[]; nextAction: boolean }
	| { type: 'COLLECT_PART'; board: Tile[]; partsCollected: string[] }
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
	| { type: 'USE_ITEM'; item: ItemType }
	| { type: 'GAME_OVER'; reason: string }
	| { type: 'SET_SHOW_RESET_MODAL'; show: boolean }
	| { type: 'RESET_GAME' };

function gameReducer(state: GameState, action: GameAction): GameState {
	let nextState: GameState;
	const actionCount = state.actionCount - 1;
	const selectedAction = actionCount === 0 ? null : state.selectedAction;

	switch (action.type) {
		case 'SET_PLAYERS':
			{
				const players = assignPlayers(action.count);
				nextState = {
					...state,
					players,
					firstPlayerId: players[0].id,
					hurricaneMeter: initHurricaneMeter(action.count),
				};
			}
			break;
		case 'SET_DIFFICULTY':
			nextState = { ...state, meterProgress: action.index };
			break;
		case 'SELECT_ACTION':
			nextState = {
				...state,
				selectedAction: action.action,
				prevAction: state.selectedAction,
			};
			break;
		case 'MOVE_TILES':
			if (state.actionCount === 0) {
				nextState = state;
			}
			nextState = {
				...state,
				actionCount,
				selectedAction,
				players: action.players,
			};
			break;
		case 'REMOVE_SAND':
			{
				if (state.actionCount === 0) {
					nextState = state;
				}
				nextState = {
					...state,
					actionCount,
					selectedAction: action.nextAction ? state.prevAction : selectedAction,
					board: action.board,
				};
			}
			break;
		case 'COLLECT_PART':
			nextState = {
				...state,
				board: action.board,
				partsCollected: action.partsCollected,
			};
			break;
		case 'SET_SHOW_REVEAL_MODAL':
			nextState = {
				...state,
				prevAction: action.prevAction,
				showRevealModal: action.show,
			};
			break;
		case 'REVEAL_TILE':
			{
				nextState = {
					...state,
					players: action.players,
					actionCount: state.actionCount - 1,
					board: action.board,
				};
			}
			break;
		case 'SET_SHOW_END_TURN_MODAL':
			nextState = { ...state, showEndTurnModal: action.show };
			break;
		case 'SET_SHOW_RESET_MODAL':
			nextState = {
				...state,
				showResetModal: action.show,
			};
			break;
		case 'START_DRAWING':
			nextState = {
				...state,
				showEndTurnModal: false,
				isDrawingHurricaneCards: true,
				turnStatus: 'Drawing cards...',
			};
			break;
		case 'FINISH_DRAWING':
			nextState = {
				...state,
				isDrawingHurricaneCards: false,
				turnStatus: null,
			};
			break;
		case 'SET_TURN_STATUS':
			nextState = {
				...state,
				actionCount: 4,
				players: action.players,
				turnStatus: action.status,
				turnCount: action.turnCount,
			};
			break;
		case 'MOVE_HURRICANE':
			{
				nextState = {
					...state,
					board: action.board,
				};
			}
			break;
		case 'DRINK_WATER':
			{
				nextState = {
					...state,
					players: action.players,
				};
			}
			break;
		case 'DRAW_HURRICANE_CARD':
			{
				nextState = {
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
			break;
		case 'RESHUFFLE_DECK':
			{
				nextState = {
					...state,
					hurricaneDeck: action.deck,
				};
			}
			break;
		case 'DRAW_ITEM_CARD':
			{
				if (state.itemDeck.length === 0) {
					nextState = state;
				}
				nextState = {
					...state,
					recentlyDrawnItemCard: action.card,
					itemDeck: action.items,
				};
			}
			break;
		case 'USE_ITEM':
			nextState = {
				...state,
			};
			break;
		case 'GAME_OVER':
			nextState = {
				...state,
				endGameState: { status: 'Defeat', reason: action.reason },
			};
			break;
		case 'RESET_GAME':
			nextState = {
				...initialState,
				gameId: !state.gameId,
				board: shuffleBoard(),
				hurricaneDeck: shuffleHurricaneDeck(),
				itemDeck: shuffleItemDeck(),
			};
			break;
		default:
			nextState = state;
	}

	const exitTileIndex = state.board.findIndex(
		(tile) => tile.info?.revealedType === 'Exit',
	);
	if (
		nextState.partsCollected.length === 4 &&
		nextState.board[exitTileIndex].info?.revealed &&
		nextState.board[exitTileIndex].info?.sandPoints < 2 &&
		!nextState.players.find(
			(player) => player.currentTileId !== nextState.board[exitTileIndex].id,
		)
	) {
		return {
			...nextState,
			endGameState: {
				status: 'Victory',
			},
		};
	}
	return nextState;
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
