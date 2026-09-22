import type { Item } from "./items";

export type PlayerCount = 2 | 3 | 4 | 5;

export function assignPlayers(playerCount: PlayerCount) {
  const players: PlayerType[] = [];
  for (let i = 0; i < playerCount;) {
    const playerCard = playerCards[Math.floor(Math.random() * 6)];
    if (!players.includes(playerCard)) {
      players.push(playerCard);
      i++;
    }
  }
  return players;
}

export type PlayerType = {
  title: string;
  ability: string;
  waterLevel: 3 | 4 | 5;
  currentWaterLevel: number;
  items: Item[];
};

const playerCards: PlayerType[] = [
  {
    title: "Excavator",
    ability: "Digs two sand points at once",
    waterLevel: 3,
    currentWaterLevel: 3,
    items: [],
  },
  {
    title: "Hiker",
    ability: "Never stuck in sand; can carry one other player while moving",
    waterLevel: 3,
    currentWaterLevel: 3,
    items: [],
  },
  {
    title: "Traveler",
    ability: "Can move and do things diagonally",
    waterLevel: 4,
    currentWaterLevel: 4,
    items: [],
  },
  {
    title: "Cartographer",
    ability:
      "Can move other players up to three spaces away from their current tile according to their movement abilities",
    waterLevel: 4,
    currentWaterLevel: 4,
    items: [],
  },
  {
    title: "Weather forecaster",
    ability:
      "Can spend an action looking at the next hurricane cards depending on the hurricane level and optionally defer the card to the end of the deck, and can spend an action to draw one less storm card",
    waterLevel: 4,
    currentWaterLevel: 4,
    items: [],
  },
  {
    title: "Water dispenser",
    ability:
      "Can share water to players on neighboring tiles, and can spend an action to increase their water level by one when standing on revealed Water tiles",
    waterLevel: 5,
    currentWaterLevel: 5,
    items: [],
  },
];
