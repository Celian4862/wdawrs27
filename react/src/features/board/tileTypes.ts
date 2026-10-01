import type { hintVariants } from './hintVariants';

export interface TileType {
	id: number;
	sandMarks: number;
	info?: TileDefinition & {
		revealed: boolean;
	};
}

export type TileDefinition =
	| ((
			| {
					unrevealedType: 'Start';
					revealedType: 'Item';
			  }
			| {
					unrevealedType: 'Greenth';
					revealedType: 'Water' | 'Fake';
			  }
			| {
					unrevealedType: 'Sand';
					revealedType: 'Item' | 'Shade' | 'Exit';
			  }
	  ) & {
			hintVariant: never;
	  })
	| {
			unrevealedType: 'Sand';
			revealedType: 'Hint';
			hintVariant: (typeof hintVariants)[number];
	  };
