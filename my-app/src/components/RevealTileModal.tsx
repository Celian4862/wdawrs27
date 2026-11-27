import {
	useIsMutating,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { revealTile } from "#/server/game/helpers";
import type { HurricaneDrawStatus } from "#/server/game/types";

export default function RevealTileModal({
	gameId,
	actionCount,
	revealed,
	hurricaneDrawStatus,
}: {
	gameId: string;
	actionCount: number;
	revealed: boolean;
	hurricaneDrawStatus: HurricaneDrawStatus;
}) {
	const queryClient = useQueryClient();
	const gameKey = ["game", gameId];
	const mutation = useMutation({
		mutationFn: revealTile,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: gameKey });
		},
		onSuccess: (updatedGameState) => {
			queryClient.setQueryData(gameKey, updatedGameState);
		},
		onError: (err) => {
			console.error(err.message);
			queryClient.invalidateQueries({ queryKey: gameKey });
		},
	});
	const isAnyGameActionPending = useIsMutating({ mutationKey: gameKey }) > 0;
	const disabled =
		mutation.isPending ||
		actionCount === 0 ||
		revealed ||
		!!hurricaneDrawStatus ||
		isAnyGameActionPending;

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="default"
					disabled={disabled}
					className={`rounded-lg border px-3 py-6 text-base motion-safe:transition ${
						disabled
							? ""
							: "bg-green-700 hover:bg-green-600 active:brightness-50"
					}`}
				>
					Reveal Tile
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="w-fit backdrop-blur-xl">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-2xl">
						Reveal this tile?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xl">
						This cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="*:p-6 *:text-xl">
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={disabled}
						onClick={() => {
							mutation.mutate();
						}}
						className="bg-green-700 hover:bg-green-600 active:brightness-50"
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
