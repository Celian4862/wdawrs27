// src/context/GameContext.tsx
import { createContext, type ReactNode, useContext, useReducer } from 'react';
import type { EndGameState } from '@/components/EndGameScreen';
import { initHurricaneMeter } from '@/data/initHurricaneMeter';
import { shuffleHurricaneCards } from '@/data/shuffleHurricaneCards';

interface GameState {
	playerCount: number;
	hurricaneMeter: number[];
	meterProgress: number;
	hurricaneDeck: string[];
	hurricaneDeckCounter: number;
	discardedHurricaneDeck: Record<string, number>;
	recentlyDrawnHurricaneCard: string;
	isDrawingHurricaneCards: boolean;
	showConfirmEndTurnModal: boolean;
	turnStatus: string | null;
	endGameState: EndGameState;
}

type GameAction =
	| { type: 'SET_PLAYER_COUNT'; count: number }
	| { type: 'SET_DIFFICULTY'; index: number }
	| { type: 'SET_SHOW_CONFIRM_MODAL'; show: boolean }
	| { type: 'START_DRAWING' }
	| { type: 'FINISH_DRAWING' }
	| { type: 'SET_TURN_STATUS'; status: string | null }
	| { type: 'DRAW_SINGLE_CARD'; card: string }
	| { type: 'RESHUFFLE_DECK', deck: string[] }
	| { type: 'GAME_OVER'; reason: string };

const initialDeck = shuffleHurricaneCards();

const initialState: GameState = {
	playerCount: 0,
	hurricaneMeter: [],
	meterProgress: -1,
	hurricaneDeck: initialDeck,
	hurricaneDeckCounter: 0,
	discardedHurricaneDeck: Object.fromEntries(
		initialDeck.map((key) => [key, 0]),
	),
	recentlyDrawnHurricaneCard: 'None',
	isDrawingHurricaneCards: false,
	showConfirmEndTurnModal: false,
	turnStatus: null,
	endGameState: {},
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
		case 'SET_SHOW_CONFIRM_MODAL':
			return { ...state, showConfirmEndTurnModal: action.show };
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
		case 'DRAW_SINGLE_CARD':
			return {
				...state,
				recentlyDrawnHurricaneCard: action.card,
				hurricaneDeckCounter: state.hurricaneDeckCounter + 1,
				meterProgress:
					action.card === 'Hurricane Up'
						? state.meterProgress + 1
						: state.meterProgress,
				discardedHurricaneDeck: {
					...state.discardedHurricaneDeck,
					[action.card]: (state.discardedHurricaneDeck[action.card] ?? 0) + 1,
				},
			};
		case 'RESHUFFLE_DECK': {
			return {
				...state,
				hurricaneDeck: action.deck,
				hurricaneDeckCounter: 0,
				discardedHurricaneDeck: Object.fromEntries(action.deck.map((k) => [k, 0])),
			};
		}
		case 'GAME_OVER':
			return {
				...state,
				endGameState: { status: 'Defeat', reason: action.reason },
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
