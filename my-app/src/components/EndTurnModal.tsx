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
import type { HurricaneDrawStatus } from "#/server/game/types";

export default function EndTurnModal({
	disabled,
	hurricaneDrawStatus,
}: {
	disabled: boolean;
	hurricaneDrawStatus: HurricaneDrawStatus;
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className={`rounded-lg border bg-red-600/70 px-3 py-6 text-base font-semibold motion-safe:transition ${
						hurricaneDrawStatus
							? "cursor-not-allowed brightness-50"
							: "hover:bg-red-600 active:brightness-50"
					}`}
				>
					End Turn
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="w-fit backdrop-blur-xl">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-2xl">
						End your turn?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xl">
						This will forfeit all leftover actions.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="*:p-6 *:text-xl">
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {}}
						className="bg-red-700 hover:bg-red-600 active:brightness-50"
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
