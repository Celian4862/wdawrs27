import GameInfoHeading from '../game-info/GameInfoHeading';
import GameInfoSection from '../game-info/GameInfoSection';
import { tileLegend } from './legend';

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
					{tileLegend.map((sym) => {
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
		</GameInfoSection>
	);
}
