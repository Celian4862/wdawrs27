export const itemTypes = [
	'Sand Remover',
	'Flying Tool',
	'Thirst Shield',
	'X-Ray Goggles',
	'Add 2 Water',
	'Speed Boost',
] as const;

type ItemType = (typeof itemTypes)[number];

export interface Item {
	id: number;
	type: ItemType;
}

const itemsPartial: ItemType[] = [
	'Sand Remover',
	'Sand Remover',
	'Sand Remover',
	'Flying Tool',
	'Flying Tool',
	'Flying Tool',
	'Thirst Shield',
	'Thirst Shield',
	'X-Ray Goggles',
	'X-Ray Goggles',
	'Add 2 Water',
	'Speed Boost',
];

export const items: Item[] = [];
itemsPartial.forEach((itemName, index) => {
	items[index] = {
		id: index,
		type: itemName,
	};
});
