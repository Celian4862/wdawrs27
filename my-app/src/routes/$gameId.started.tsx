import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$gameId/started")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="box-border grid w-screen grid-cols-1 gap-6 p-10 lg:h-dvh lg:grid-cols-11 lg:gap-10 lg:pb-0 xl:grid-cols-2">
			<div className="flex h-full flex-col gap-4 lg:col-span-5 lg:min-h-0 lg:overflow-hidden lg:pb-10 xl:col-span-1">
				{/* <HurricaneMeter hurricaneMeter={state.hurricaneMeter} /> */}
				<div className="flex min-h-0 flex-1 items-center justify-center">
					{/* <Board /> */}
				</div>
			</div>

			<div className="h-full min-h-0 lg:col-span-6 lg:flex lg:flex-col xl:col-span-1">
				<div className="pr-2 lg:h-full lg:overflow-y-auto">
					<section className="flex flex-col-reverse gap-5 py-5 lg:flex-col">
						{/* <ActionPanel /> */}
						<div className="flex flex-col gap-5">
							{/* <PlayerCards /> */}
							{/* <HurricaneDeck /> */}
							{/* <ItemDeck /> */}
							{/* <PartsSection /> */}
							{/* <Legend /> */}
							{/* <ResetButton /> */}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
