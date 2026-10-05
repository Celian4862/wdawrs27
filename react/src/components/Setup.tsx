import { useGame } from './GameContext';

export default function Setup({ playerSetup }: { playerSetup: boolean }) {
	const { dispatch } = useGame();

	return (
		<div className="min-h-lvh flex justify-center">
			<div className="flex flex-col justify-center">
				<div className="text-center">
					<h1 className="text-2xl pb-6">
						{playerSetup ? 'How many players?' : 'What difficulty level?'}
					</h1>
					<div className="grid grid-cols-2 gap-3">
						{(playerSetup
							? [2, 3, 4, 5]
							: ['Easy', 'Normal', 'Difficult', 'Extreme']
						).map((element, index) => (
							<button
								key={element}
								type="button"
								className="p-2 text-xl border rounded-lg"
								onClick={() =>
									playerSetup
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
