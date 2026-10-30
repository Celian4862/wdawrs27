export const itemTypes = {
	sandRemover: {
		maxCount: 3,
		info: {
			type: "Sand Remover",
			description:
				"Remove all sand points from your tile or a neighboring tile. Use at any time.",
		},
	},
	flyingTool: {
		maxCount: 3,
		info: {
			type: "Flying Tool",
			description:
				"Fly from one tile to any unobstructed tile. Use at any time.",
		},
	},
	thirstShield: {
		maxCount: 2,
		info: {
			type: "Thirst Shield",
			description:
				"All players on your tile will be protected from Thirst cards until your next turn. Use at any time.",
		},
	},
	xRayGoggles: {
		maxCount: 2,
		info: {
			type: "X-Ray Goggles",
			description:
				"See the revealed type of any unrevealed tile. Use at any time.",
		},
	},
	addTwoWater: {
		maxCount: 1,
		info: {
			type: "Add 2 Water",
			description:
				"All players on your tile gain +2 water points. Use at any time.",
		},
	},
	speedBoost: {
		maxCount: 1,
		info: {
			type: "Speed Boost",
			description: "You can do 2 more actions. Use on your turn.",
		},
	},
} as const;
