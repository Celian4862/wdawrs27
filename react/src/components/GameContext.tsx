import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';
import type { EndGameState } from '@/components/EndGameScreen';
import { initHurricaneMeter } from '@/data/initHurricaneMeter';
import { type ItemType, shuffleItemDeck } from '@/data/items';
import { type ActivePlayer, assignPlayers } from '@/data/players';
import {
	type HurricaneCard,
	shuffleHurricaneDeck,
	specialCards,
} from '@/data/shuffleHurricaneDeck';
import { shuffleBoard, sumSandPoints, type Tile } from '@/data/tiles';

interface GameState {
	gameId: boolean;
	players: ActivePlayer[];
	board: Tile[];
	selectedAction: string | null;
	showRevealModal: boolean;
	sandMarkCount: number;
	hurricaneMeter: number[];
	meterProgress: number;
	hurricaneDeck: HurricaneCard[];
	hurricaneDeckCounter: number;
	discardedHurricaneDeck: Record<string, number>;
	recentlyDrawnHurricaneCard: HurricaneCard;
	isDrawingHurricaneCards: boolean;
	showEndTurnModal: boolean;
	turnStatus: string | null;
	itemDeck: ItemType[];
	itemDeckCounter: number;
	drawnItemDeck: Record<string, number>;
	recentlyDrawnItemCard: string;
	partsCollected: string[];
	endGameState: EndGameState;
	showResetModal: boolean;
}

const initialHurricaneDeck = shuffleHurricaneDeck();
const initialBoard = shuffleBoard();

const initialState: GameState = {
	gameId: false,
	players: [],
	board: initialBoard,
	selectedAction: null,
	showRevealModal: false,
	sandMarkCount: sumSandPoints(initialBoard),
	hurricaneMeter: [],
	meterProgress: -1,
	hurricaneDeck: initialHurricaneDeck,
	hurricaneDeckCounter: 0,
	discardedHurricaneDeck: Object.fromEntries(
		initialHurricaneDeck.map((key) => initHurricaneDiscard(key)),
	),
	recentlyDrawnHurricaneCard: { type: 'None' },
	isDrawingHurricaneCards: false,
	showEndTurnModal: false,
	turnStatus: null,
	itemDeck: shuffleItemDeck(),
	itemDeckCounter: 12,
	drawnItemDeck: {
		'Sand Remover': 0,
		'Flying Tool': 0,
		'Thirst Shield': 0,
		'X-Ray Goggles': 0,
		'Add 2 Water': 0,
		'Speed Boost': 0,
	},
	recentlyDrawnItemCard: 'None',
	partsCollected: [],
	endGameState: {},
	showResetModal: false,
};

type GameAction =
	| { type: 'SET_PLAYERS'; count: number }
	| { type: 'SET_DIFFICULTY'; index: number }
	| { type: 'SELECT_ACTION'; action: string | null }
	| { type: 'SET_SHOW_REVEAL_MODAL'; show: boolean; }
	| { type: 'REVEAL_TILE'; tile: number }
	| { type: 'SET_SHOW_END_TURN_MODAL'; show: boolean }
	| { type: 'START_DRAWING' }
	| { type: 'FINISH_DRAWING' }
	| { type: 'SET_TURN_STATUS'; players: ActivePlayer[], status: string | null }
	| { type: 'MOVE_HURRICANE'; board: Tile[] }
	| { type: 'DRINK_WATER'; players: ActivePlayer[] }
	| { type: 'DRAW_HURRICANE_CARD'; card: HurricaneCard }
	| { type: 'RESHUFFLE_DECK'; deck: HurricaneCard[] }
	| { type: 'DRAW_ITEM_CARD'; card: string }
	| { type: 'GAME_OVER'; reason: string }
	| { type: 'SET_SHOW_RESET_MODAL'; show: boolean }
	| { type: 'RESET_GAME' };

function initHurricaneDiscard(key: HurricaneCard) {
	if (specialCards.includes(key.type)) {
		return [key.type, 0];
	}
	return [`Move ${key.distance} ${key.direction}`, 0];
}

function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case 'SET_PLAYERS':
			return {
				...state,
				players: assignPlayers(action.count),
				hurricaneMeter: initHurricaneMeter(action.count),
			};
		case 'SET_DIFFICULTY':
			return { ...state, meterProgress: action.index };
		case 'SELECT_ACTION':
			return { ...state, selectedAction: action.action };
		case 'SET_SHOW_REVEAL_MODAL':
			return { ...state, showRevealModal: action.show };
		case 'REVEAL_TILE': {
			const newBoard = [...state.board];
			const targetTileIndex = newBoard.findIndex(
				(tile) => tile.id === action.tile,
			);
			if (newBoard[targetTileIndex].info) {
				newBoard[targetTileIndex].info.revealed = true;
			}
			return { ...state, board: newBoard };
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
			return { ...state, players: action.players, turnStatus: action.status };
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
			const discardKey = specialCards.includes(action.card.type)
				? action.card.type
				: `Move ${action.card.distance} ${action.card.direction}`;
			return {
				...state,
				selectedAction: null,
				recentlyDrawnHurricaneCard: action.card,
				hurricaneDeckCounter: state.hurricaneDeckCounter + 1,
				meterProgress:
					action.card.type === 'Hurricane Up'
						? state.meterProgress + 1
						: state.meterProgress,
				discardedHurricaneDeck: {
					...state.discardedHurricaneDeck,
					[discardKey]: (state.discardedHurricaneDeck[discardKey] ?? 0) + 1,
				},
			};
		}
		case 'RESHUFFLE_DECK': {
			return {
				...state,
				hurricaneDeck: action.deck,
				hurricaneDeckCounter: 0,
				discardedHurricaneDeck: Object.fromEntries(
					action.deck.map((key) => initHurricaneDiscard(key)),
				),
			};
		}
		case 'DRAW_ITEM_CARD': {
			return {
				...state,
				recentlyDrawnItemCard: action.card,
				itemDeckCounter: state.itemDeckCounter + 1,
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
