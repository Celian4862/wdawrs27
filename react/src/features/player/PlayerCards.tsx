import GameInfoHeading from '@/features/game-info/GameInfoHeading';
import GameInfoSection from '@/features/game-info/GameInfoSection';
import PlayerDetails from '@/features/player/PlayerDetails';
import { useGame } from '@/features/utility/GameContext';

export default function PlayerCards() {
	const { state } = useGame();

	const currentPlayer = state.players[0];
	return (
		<GameInfoSection>
			<GameInfoHeading
				heading="Player Cards"
				subheading={`Turn ${state.turnCount}`}
			/>
			<div className="flex flex-col gap-3">
				<h3 className="text-lg">Current player:</h3>
				<PlayerDetails player={currentPlayer} isCurrent={true} />
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
