import { tileColors } from "./Board";

export default function Legend() {
	return (
		<section className="rounded-xl border p-6">
			<div className={`flex flex-wrap items-center justify-between`}>
				<h1 className="text-2xl">Board Guide</h1>
			</div>
			<table className="w-full border-separate border-spacing-2 text-center text-lg">
				<thead>
					<tr>
						<th>Tile Color</th>
						<th>Meaning</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(tileColors).map((sym) => (
						<tr key={sym[0]}>
							<td
								className={`w-full ${sym[1]} ${sym[0] === "Shade" ? "border" : ""}`}
							/>
							<td>{sym[0]}</td>
						</tr>
					))}
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
		</section>
	);
}

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
