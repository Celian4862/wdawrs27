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
	hurricaneDrawStatus,
}: {
	hurricaneDrawStatus: HurricaneDrawStatus;
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="default"
					className={`rounded-lg border bg-green-700 px-3 py-6 text-base motion-safe:transition ${
						hurricaneDrawStatus
							? "cursor-not-allowed brightness-50"
							: "hover:bg-green-600 active:brightness-50"
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
						onClick={async () => {
							try {
								await revealTile();
							} catch (err) {
								console.error(err);
							}
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
