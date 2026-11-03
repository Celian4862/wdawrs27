import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$gameId/started")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$gameId/started"!</div>;
}
