export const partOrientations = ['Row', 'Col'] as const;
export const partNames = ['Core', 'Fan', 'Motor', 'Pointer'] as const;
export const hurricaneId = 12 as const;
export const startTileId = 19 as const;
export const greenthTileIds = [3, 5, 21] as const;
export const sandTileIds = [
	0, 1, 2, 4, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20, 22, 23, 24,
] as const;
export const sandPointIds = new Set([2, 6, 8, 10, 14, 16, 18, 22]);
export const tileIds = [startTileId, ...greenthTileIds, ...sandTileIds];
