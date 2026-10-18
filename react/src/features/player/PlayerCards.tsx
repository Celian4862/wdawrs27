import GameInfoHeading from '@/game-info/GameInfoHeading';
import GameInfoSection from '@/game-info/GameInfoSection';
import PlayerDetails from '@/player/PlayerDetails';
import { useGame } from '@/utility/GameContext';

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
				<PlayerDetails playerIndex={0} isCurrent={true} />
				<details>
					<summary className="mb-3 cursor-pointer">Other players</summary>
					<div className="flex flex-col gap-3">
						{state.players.map((player, idx) => {
							if (idx > 0) {
								return (
									<PlayerDetails
										key={player.role.title}
										playerIndex={idx}
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
