import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';
import type { EndGameState } from '@/components/EndGameScreen';
import { getTilePlayer } from '@/data/actions';
import { initHurricaneMeter } from '@/data/initHurricaneMeter';
import { type ItemType, shuffleItemDeck } from '@/data/items';
import { type ActivePlayer, assignPlayers } from '@/data/players';
import {
	type HurricaneCard,
	shuffleHurricaneDeck,
	specialCards,
} from '@/data/shuffleHurricaneDeck';
import {
	findNeighboring,
	findSandPoints,
	shuffleBoard,
	sumSandPoints,
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
	turnCount: number;
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
	firstPlayerId: -1,
	board: initialBoard,
	actionCount: 4,
	selectedAction: null,
	prevAction: null,
	showRevealModal: false,
	sandMarkCount: sumSandPoints(initialBoard),
	hurricaneMeter: [],
	meterProgress: -1,
	hurricaneDeck: initialHurricaneDeck,
	hurricaneDeckCounter: 31,
	discardedHurricaneDeck: Object.fromEntries(
		initialHurricaneDeck.map((key) => initHurricaneDiscard(key)),
	),
	recentlyDrawnHurricaneCard: { type: 'None' },
	isDrawingHurricaneCards: false,
	showEndTurnModal: false,
	turnStatus: null,
	turnCount: 1,
	itemDeck: shuffleItemDeck(),
	itemDeckCounter: 12,
	drawnItemDeck: {
		'Sand Remover': 3,
		'Flying Tool': 3,
		'Thirst Shield': 2,
		'X-Ray Goggles': 2,
		'Add 2 Water': 1,
		'Speed Boost': 1,
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
	| { type: 'MOVE_TILES'; players: ActivePlayer[] }
	| { type: 'REMOVE_SAND'; tilePosition: number }
	| { type: 'GAIN_WATER'; players: ActivePlayer[] }
	| { type: 'SET_SHOW_REVEAL_MODAL'; prevAction: string | null; show: boolean }
	| { type: 'REVEAL_TILE'; board: Tile[]; players: ActivePlayer[]; }
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
	| { type: 'DRAW_HURRICANE_CARD'; card: HurricaneCard }
	| { type: 'RESHUFFLE_DECK'; deck: HurricaneCard[]; deckCounter: number }
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
	const actionCount = state.actionCount - 1;
	const selectedAction = actionCount === 0 ? null : state.selectedAction;

	switch (action.type) {
		case 'SET_PLAYERS': {
			const players = assignPlayers(action.count);
			return {
				...state,
				players,
				firstPlayerId: players[players.findIndex((player) => player.isTurn)].id,
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
			const { currentPlayerIndex, currentTileIndex } = getTilePlayer(
				state.board,
				state.players,
			);

			if (targetTile.info) {
				newBoard[action.tilePosition] = {
					id: targetTile.id,
					info: {
						...targetTile.info,
						sandPoints:
							state.players[currentPlayerIndex].role.title === 'Digger'
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
								state.players[currentPlayerIndex].role.title,
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
			const discardKey = specialCards.includes(action.card.type)
				? action.card.type
				: `Move ${action.card.distance} ${action.card.direction}`;
			return {
				...state,
				selectedAction: null,
				recentlyDrawnHurricaneCard: action.card,
				hurricaneDeckCounter: state.hurricaneDeckCounter - 1,
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
				hurricaneDeckCounter: action.deckCounter,
				discardedHurricaneDeck: Object.fromEntries(
					action.deck.map((key) => initHurricaneDiscard(key)),
				),
			};
		}
		case 'DRAW_ITEM_CARD': {
			return {
				...state,
				recentlyDrawnItemCard: action.card,
				drawnItemDeck: {
					...state.drawnItemDeck,
					[action.card]: state.drawnItemDeck[action.card] - 1
				},
				itemDeckCounter: state.itemDeckCounter - 1,
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
