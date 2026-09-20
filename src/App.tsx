import { useState } from "react";
import Board from "./components/Board";
import HurricaneDeck from "./components/HurricaneDeck";
import ItemDeck from "./components/ItemDeck";
import type { Item } from "./data/items";
import {
  assignPlayers,
  type PlayerCount,
  type PlayerType,
} from "./data/player-cards";
import PlayerInfo from "./components/PlayerInfo";

export default function App() {
  const [playerCount, setPlayerCount] = useState<PlayerCount | null>(null);
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [discardedItems] = useState<Partial<Record<Item, number>>>({});
  const [thirstCardsCount, setThirstCardsCount] = useState(0);
  const [hurricaneUpCardsCount, setHurricaneUpCardsCount] = useState(0);
  const [moveOneUpCardsCount, setMoveOneUpCardsCount] = useState(0);
  const [moveOneDownCardsCount, setMoveOneDownCardsCount] = useState(0);
  const [moveOneLeftCardsCount, setMoveOneLeftCardsCount] = useState(0);
  const [moveOneRightCardsCount, setMoveOneRightCardsCount] = useState(0);
  const [moveTwoUpCardsCount, setMoveTwoUpCardsCount] = useState(0);
  const [moveTwoDownCardsCount, setMoveTwoDownCardsCount] = useState(0);
  const [moveTwoLeftCardsCount, setMoveTwoLeftCardsCount] = useState(0);
  const [moveTwoRightCardsCount, setMoveTwoRightCardsCount] = useState(0);
  const [moveThreeUpCardsCount, setMoveThreeUpCardsCount] = useState(0);
  const [moveThreeDownCardsCount, setMoveThreeDownCardsCount] = useState(0);
  const [moveThreeLeftCardsCount, setMoveThreeLeftCardsCount] = useState(0);
  const [moveThreeRightCardsCount, setMoveThreeRightCardsCount] = useState(0);
  const drawnCardsCount =
    thirstCardsCount +
    hurricaneUpCardsCount +
    moveOneUpCardsCount +
    moveOneDownCardsCount +
    moveOneLeftCardsCount +
    moveOneRightCardsCount +
    moveTwoUpCardsCount +
    moveTwoDownCardsCount +
    moveTwoLeftCardsCount +
    moveTwoRightCardsCount +
    moveThreeUpCardsCount +
    moveThreeDownCardsCount +
    moveThreeLeftCardsCount +
    moveThreeRightCardsCount;
  const incrementRandomCardCount = () => {
    // Only for testing
    const incrementers = [
      setThirstCardsCount,
      setHurricaneUpCardsCount,
      setMoveOneUpCardsCount,
      setMoveOneDownCardsCount,
      setMoveOneLeftCardsCount,
      setMoveOneRightCardsCount,
      setMoveTwoUpCardsCount,
      setMoveTwoDownCardsCount,
      setMoveTwoLeftCardsCount,
      setMoveTwoRightCardsCount,
      setMoveThreeUpCardsCount,
      setMoveThreeDownCardsCount,
      setMoveThreeLeftCardsCount,
      setMoveThreeRightCardsCount,
    ];
    const randomIncrementer =
      incrementers[Math.floor(Math.random() * incrementers.length)];

    randomIncrementer((count) => count + 1);
  };

  return (
    <>
      {playerCount ? (
        <div className="grid w-fit grid-cols-2 items-start gap-15">
          <div>
            <Board />
            <PlayerInfo players={players} />
          </div>
          <div>
            <HurricaneDeck
              drawnCardsCount={drawnCardsCount}
              thirstCardsCount={thirstCardsCount}
              hurricaneUpCardsCount={hurricaneUpCardsCount}
              moveOneUpCardsCount={moveOneUpCardsCount}
              moveOneDownCardsCount={moveOneDownCardsCount}
              moveOneLeftCardsCount={moveOneLeftCardsCount}
              moveOneRightCardsCount={moveOneRightCardsCount}
              moveTwoUpCardsCount={moveTwoUpCardsCount}
              moveTwoDownCardsCount={moveTwoDownCardsCount}
              moveTwoLeftCardsCount={moveTwoLeftCardsCount}
              moveTwoRightCardsCount={moveTwoRightCardsCount}
              moveThreeUpCardsCount={moveThreeUpCardsCount}
              moveThreeDownCardsCount={moveThreeDownCardsCount}
              moveThreeLeftCardsCount={moveThreeLeftCardsCount}
              moveThreeRightCardsCount={moveThreeRightCardsCount}
            />
            {/* Button below is only for testing count increments */}
            <button
              type="button"
              onClick={incrementRandomCardCount}
              className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
            >
              Draw random card
            </button>
            <ItemDeck discardedItems={discardedItems} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-sm text-center">
            <p className="text-xl font-semibold text-white">
              How many players?
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {([2, 3, 4, 5] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    setPlayerCount(count);
                    setPlayers(assignPlayers(count));
                  }}
                  className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-lg font-semibold text-cyan-100 transition hover:bg-cyan-300/20 focus:outline-2 focus:outline-offset-2 focus:outline-cyan-300"
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
