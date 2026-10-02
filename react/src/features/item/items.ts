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

export const itemMaxCounts: Record<ItemType, number> = {
	'Sand Remover': 3,
	'Flying Tool': 3,
	'Thirst Shield': 2,
	'X-Ray Goggles': 2,
	'Add 2 Water': 1,
	'Speed Boost': 1,
};

const itemsPartial: ItemType[] = (
	Object.entries(itemMaxCounts) as [ItemType, number][]
).flatMap(([item, count]) => Array(count).fill(item));

export const items: Item[] = [];
itemsPartial.forEach((itemName, index) => {
	items[index] = {
		id: index,
		type: itemName,
	};
});
