import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	redirect,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { getUserSessionStatus } from "#/server/game.functions";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ location: { pathname } }) => {
		const { gameId: activeGameId, status } = await getUserSessionStatus();

		// User has an active game, but isn't currently viewing it
		if (activeGameId) {
			if (status === "waiting" && pathname !== `/${activeGameId}/waiting`) {
				throw redirect({
					to: "/$gameId/waiting",
					params: { gameId: activeGameId },
				});
			} else if (
				status === "started" &&
				pathname !== `/${activeGameId}/started`
			) {
				throw redirect({
					to: "/$gameId/started",
					params: { gameId: activeGameId },
				});
			} else if (status === "finished" && pathname !== "/") {
				throw redirect({ to: "/" });
			}
		} else if (pathname !== "/") {
			throw redirect({ to: "/" });
		}
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Desert Survival Board Game",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: () => {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
				<h1 className="mb-2 text-2xl font-bold">404 - Page Not Found</h1>
				<p className="mb-4 text-gray-600">
					Looks like this page is buried under too much sand.
				</p>
				<a
					href="/"
					className="rounded bg-amber-600 px-4 py-2 text-black hover:bg-amber-700"
				>
					Return Home
				</a>
			</div>
		);
	},
	errorComponent: () => {
		return (
			<div className="flex h-dvh justify-center">
				<div className="flex flex-col justify-center text-center">
					<h1 className="text-3xl">Whoops!</h1>
					<p className="mt-2 text-xl">An unexpected error occurred.</p>
				</div>
			</div>
		);
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
