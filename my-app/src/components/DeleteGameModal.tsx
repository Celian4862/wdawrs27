import { useNavigate } from "@tanstack/react-router";
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
import { deleteGame } from "#/server/game.functions";

export default function DeleteGameModal({ gameId }: { gameId: string }) {
	const navigate = useNavigate();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					className="w-full rounded-lg border-4 border-red-300 bg-red-700 p-6 text-2xl hover:brightness-130 active:brightness-85 motion-safe:transition"
				>
					Delete Game
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="w-fit backdrop-blur-xl">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-2xl">
						Are you sure?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xl">
						This will kick everyone out of the lobby and return them to the home
						screen.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="*:p-6 *:text-xl">
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							try {
								await deleteGame({ data: { gameId } });
								navigate({ to: "/" });
							} catch (err) {
								console.error(err);
							}
						}}
						className="bg-red-700"
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
