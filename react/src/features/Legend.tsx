import GameInfoHeading from '@/game-info/GameInfoHeading';
import GameInfoSection from '@/game-info/GameInfoSection';

export default function Legend() {
	return (
		<GameInfoSection>
			<GameInfoHeading heading="Board Guide" subheading="" />
			<table className="w-full border-separate border-spacing-2 text-center text-lg">
				<thead>
					<tr>
						<th>Tile Color</th>
						<th>Meaning</th>
					</tr>
				</thead>
				<tbody>
					{colorLegend.map((sym) => {
						return (
							<tr key={sym[1]}>
								<td
									className={`w-full ${sym[0]} ${sym[1] === 'Shade' ? 'border' : ''}`}
								/>
								<td>{sym[1]}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<br />
			<table className="w-full border-separate border-spacing-2 text-center text-lg">
				<thead>
					<tr>
						<th>Icon</th>
						<th>Meaning</th>
					</tr>
				</thead>
				<tbody>
					{iconLegend.map((icon, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static array that never reorders or mutates
						<tr key={index}>
							<td>{icon.icon}</td>
							<td>{icon.meaning}</td>
						</tr>
					))}
				</tbody>
			</table>
		</GameInfoSection>
	);
}

const colorLegend = [
	['bg-red-700', 'Start'],
	['bg-white/80', 'Exit'],
	['bg-slate-700', 'Item'],
	['bg-lime-600', 'Greenth'],
	['bg-blue-700', 'Water'],
	['bg-amber-700', 'Fake'],
	['bg-yellow-300/80', 'Sand'],
	['bg-black', 'Shade'],
	['bg-red-950', 'Pointer'],
	['bg-gray-400', 'Motor'],
	['bg-orange-500', 'Core'],
	['bg-yellow-600', 'Fan'],
];

const iconLegend = [
	{
		icon: (
			<span className="rounded-full border bg-amber-500/90 px-1.5 py-0.5 text-[8px] font-bold text-slate-950 md:text-[10px] xl:px-2 xl:text-base">
				1
			</span>
		),
		meaning: (
			<>
				Sand Points (<em>Unobstructed Tile</em>)
			</>
		),
	},
	{
		icon: (
			<span className="rounded-full border bg-orange-600 px-1.5 py-0.5 text-[8px] font-bold text-slate-950 md:text-[10px] xl:px-2 xl:text-base">
				2
			</span>
		),
		meaning: (
			<>
				Sand Points (<em>Obstructed Tile</em>)
			</>
		),
	},
	{
		icon: <>↔️</>,
		meaning: <>Row Part Hint</>,
	},
	{
		icon: <>↕️</>,
		meaning: <>Column Part Hint</>,
	},
];
