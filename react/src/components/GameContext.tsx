// src/context/GameContext.tsx
import { createContext, type ReactNode, useContext, useReducer } from 'react';
import type { EndGameState } from '@/components/EndGameScreen';
import { initHurricaneMeter } from '@/data/initHurricaneMeter';
import { shuffleItemDeck } from '@/data/items';
import {
	type HurricaneCard,
	shuffleHurricaneDeck,
	specialCards,
} from '@/data/shuffleHurricaneDeck';
import { shuffleBoard, type Tile } from '@/data/tiles';

interface GameState {
	playerCount: number;
	board: Tile[];
	sandMarkCount: number;
	hurricaneMeter: number[];
	meterProgress: number;
	hurricaneDeck: HurricaneCard[];
	hurricaneDeckCounter: number;
	discardedHurricaneDeck: Record<string, number>;
	recentlyDrawnHurricaneCard: HurricaneCard;
	isDrawingHurricaneCards: boolean;
	showConfirmEndTurnModal: boolean;
	turnStatus: string | null;
	itemDeck: string[];
	itemDeckCounter: number;
	drawnItemDeck: Record<string, number>;
	recentlyDrawnItemCard: string;
	endGameState: EndGameState;
	showConfirmResetModal: boolean;
}

type GameAction =
	| { type: 'SET_PLAYER_COUNT'; count: number }
	| { type: 'SET_DIFFICULTY'; index: number }
	| { type: 'SET_SHOW_CONFIRM_END_TURN_MODAL'; show: boolean }
	| { type: 'START_DRAWING' }
	| { type: 'FINISH_DRAWING' }
	| { type: 'SET_TURN_STATUS'; status: string | null }
	| { type: 'DRAW_HURRICANE_CARD'; card: HurricaneCard }
	| { type: 'RESHUFFLE_DECK'; deck: HurricaneCard[] }
	| { type: 'DRAW_ITEM_CARD'; card: string }
	| { type: 'GAME_OVER'; reason: string }
	| { type: 'SET_SHOW_CONFIRM_RESET_MODAL'; show: boolean }
	| { type: 'RESET_GAME' };

const initialHurricaneDeck = shuffleHurricaneDeck();

const initialState: GameState = {
	playerCount: 0,
	board: shuffleBoard(),
	sandMarkCount: 0,
	hurricaneMeter: [],
	meterProgress: -1,
	hurricaneDeck: initialHurricaneDeck,
	hurricaneDeckCounter: 0,
	discardedHurricaneDeck: Object.fromEntries(
		initialHurricaneDeck.map((key) => {
			if (specialCards.includes(key.type)) {
				return [key.type, 0];
			}
			return [`Move ${key.distance} ${key.direction}`, 0];
		}),
	),
	recentlyDrawnHurricaneCard: { type: 'None' },
	isDrawingHurricaneCards: false,
	showConfirmEndTurnModal: false,
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
	endGameState: {},
	showConfirmResetModal: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case 'SET_PLAYER_COUNT':
			return {
				...state,
				playerCount: action.count,
				hurricaneMeter: initHurricaneMeter(action.count),
			};
		case 'SET_DIFFICULTY':
			return { ...state, meterProgress: action.index };
		case 'SET_SHOW_CONFIRM_END_TURN_MODAL':
			return { ...state, showConfirmEndTurnModal: action.show };
		case 'SET_SHOW_CONFIRM_RESET_MODAL':
			return {
				...state,
				showConfirmResetModal: action.show,
			};
		case 'START_DRAWING':
			return {
				...state,
				showConfirmEndTurnModal: false,
				isDrawingHurricaneCards: true,
				turnStatus: 'Drawing cards...',
			};
		case 'FINISH_DRAWING':
			return { ...state, isDrawingHurricaneCards: false, turnStatus: null };
		case 'SET_TURN_STATUS':
			return { ...state, turnStatus: action.status };
		case 'DRAW_HURRICANE_CARD': {
			const discardKey = specialCards.includes(action.card.type)
				? action.card.type
				: `Move ${action.card.distance} ${action.card.direction}`;
			return {
				...state,
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
					action.deck.map((k) => [k, 0]),
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
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(gameReducer, initialState);
	return (
		<GameContext.Provider value={{ state, dispatch }}>
			{children}
		</GameContext.Provider>
	);
}

export function useGame() {
	const context = useContext(GameContext);
	if (!context) throw new Error('useGame must be used within GameProvider');
	return context;
}
