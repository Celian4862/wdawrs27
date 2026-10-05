import { useGame } from './GameContext';

export default function Setup({ player_setup }: { player_setup: boolean }) {
	const { dispatch } = useGame();

	return (
		<div className="min-h-dvh flex justify-center">
			<div className="w- flex flex-col justify-center">
				<div className="text-center">
					<h1 className="text-2xl pb-6">
						{player_setup ? 'How many players?' : 'What difficulty level?'}
					</h1>
					<div className="grid grid-cols-2 gap-3">
						{(player_setup
							? [2, 3, 4, 5]
							: ['Easy', 'Normal', 'Difficult', 'Extreme']
						).map((element, index) => (
							<button
								key={element}
								type="button"
								className="p-2 text-xl border rounded-lg"
								onClick={() =>
									player_setup
										? dispatch({
												type: 'SET_PLAYER_COUNT',
												count: element as number,
											})
										: dispatch({ type: 'SET_DIFFICULTY', index })
								}
							>
								{element}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
