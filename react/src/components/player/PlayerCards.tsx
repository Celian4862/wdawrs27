import GameInfoHeading from '@/components/game-info/GameInfoHeading';
import GameInfoSection from '@/components/game-info/GameInfoSection';
import { useGame } from '../GameContext';
import PlayerDetails from './PlayerDetails';

export default function PlayerCards() {
	const { state } = useGame();

	return (
		<GameInfoSection>
			<GameInfoHeading
				heading="Player Cards"
				subheading={`Turn ${state.turnCount}`}
			/>
			<div className="flex flex-col gap-3">
				<h3 className="text-lg">Current player:</h3>
				<PlayerDetails player={state.players[0]} isCurrent={true} />
				<details>
					<summary className="mb-3 cursor-pointer">Other players</summary>
					<div className="flex flex-col gap-3">
						{state.players.map((player, idx) => {
							if (idx > 0) {
								return (
									<PlayerDetails
										key={player.role.title}
										player={player}
										isCurrent={false}
									/>
								);
							}
							return null;
						})}
					</div>
				</details>
			</div>
		</GameInfoSection>
	);
}
