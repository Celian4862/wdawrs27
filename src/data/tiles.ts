type RevealedType = "Item" | "Water" | "Fake" | "Exit" | "Shade" | "Hint";

type HintVariant =
  | "Pointer Row"
  | "Pointer Col"
  | "Motor Row"
  | "Motor Col"
  | "Core Row"
  | "Core Col"
  | "Fan Row"
  | "Fan Col";

type TileDefinition = {
  unrevealedType: "Start" | "Greenth" | "Sand";
  revealedType: RevealedType;
  hintVariant?: HintVariant;
};

type Tile =
  | (TileDefinition & {
      id: number;
      revealed: boolean;
    })
  | null;

const toIndex = (row: number, col: number) => row * 5 + col;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

const nullPosition = toIndex(2, 2); // center: 12
const startingPosition = toIndex(3, 4); // 19

const typeBPositions = [
  toIndex(0, 3), // 3
  toIndex(1, 0), // 5
  toIndex(4, 1), // 21
];

const startingTile: TileDefinition = {
  unrevealedType: "Start",
  revealedType: "Item",
};

const typeBTiles: TileDefinition[] = [
  {
    unrevealedType: "Greenth",
    revealedType: "Water", // benefit
  },
  {
    unrevealedType: "Greenth",
    revealedType: "Water", // benefit
  },
  {
    unrevealedType: "Greenth",
    revealedType: "Fake", // fake
  },
];

const typeCTiles: TileDefinition[] = [
  {
    unrevealedType: "Sand",
    revealedType: "Exit",
  },

  ...Array.from({ length: 3 }, () => ({
    unrevealedType: "Sand" as const,
    revealedType: "Shade" as const,
  })),

  ...(
    [
      "Pointer Row",
      "Pointer Col",
      "Motor Row",
      "Motor Col",
      "Core Row",
      "Core Col",
      "Fan Row",
      "Fan Col",
    ] as const
  ).map((hintVariant) => ({
    unrevealedType: "Sand" as const,
    revealedType: "Hint" as const,
    hintVariant,
  })),

  ...Array.from({ length: 8 }, () => ({
    unrevealedType: "Sand" as const,
    revealedType: "Item" as const,
  })),
];

const board: Tile[] = Array(25).fill(null);

// The center always starts empty.
board[nullPosition] = null;

// The starting tile always starts at row 4, column 5.
board[startingPosition] = {
  id: startingPosition,
  revealed: false,
  ...startingTile,
};

// Randomly assign the three type-B tiles to their three fixed positions.
const shuffledTypeBTiles = shuffle(typeBTiles);

typeBPositions.forEach((position, index) => {
  board[position] = {
    id: position,
    revealed: false,
    ...shuffledTypeBTiles[index],
  };
});

// Find every remaining open board position.
const remainingPositions = Array.from(
  { length: 25 },
  (_, index) => index,
).filter(
  (position) =>
    position !== nullPosition &&
    position !== startingPosition &&
    !typeBPositions.includes(position),
);

// Randomly place the 20 type-C tiles in those remaining positions.
const shuffledTypeCTiles = shuffle(typeCTiles);

remainingPositions.forEach((position, index) => {
  board[position] = {
    id: position,
    revealed: false,
    ...shuffledTypeCTiles[index],
  };
});

export const tiles = board;
