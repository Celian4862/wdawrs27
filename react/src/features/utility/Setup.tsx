import type React from 'react';
import { Button } from './Button';
import type { GameAction } from './GameReducer';

const buttonClasses =
	'p-2 text-xl border rounded-lg touch-manipulation active:bg-gray-100';

function SetupLayout({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="box-border flex min-h-lvh items-center justify-center">
			<div className="max-w-sm text-center md:w-full">
				<h1 className="pb-6 text-2xl">{title}</h1>
				<div className="grid grid-cols-2 gap-3">{children}</div>
			</div>
		</div>
	);
}

export function PlayerSetup({
	dispatch,
}: {
	dispatch: React.ActionDispatch<[action: GameAction]>;
}) {
	return (
		<SetupLayout title="How many players?">
			{[2, 3, 4, 5].map((count) => (
				<Button
					key={count}
					className={buttonClasses}
					onClick={() => dispatch({ type: 'SET_PLAYERS', count })}
				>
					{count}
				</Button>
			))}
		</SetupLayout>
	);
}

export function DifficultySetup({
	dispatch,
}: {
	dispatch: React.ActionDispatch<[action: GameAction]>;
}) {
	return (
		<SetupLayout title="What difficulty level?">
			{['Easy', 'Normal', 'Difficult', 'Extreme'].map((diff, index) => (
				<Button
					key={diff}
					className={buttonClasses}
					onClick={() => dispatch({ type: 'SET_DIFFICULTY', index })}
				>
					{diff}
				</Button>
			))}
		</SetupLayout>
	);
}
