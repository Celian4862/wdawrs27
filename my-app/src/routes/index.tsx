import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { difficulties } from "#/server/features/hurricane/data";
import type { Difficulty } from "#/server/features/hurricane/types";
import { joinGame, setupGame } from "#/server/game.functions";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [playerCount, setPlayerCount] = useState(2);
	const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
	const [gameId, setGameId] = useState("");
	const [playerName, setPlayerName] = useState("");
	const navigate = useNavigate();

	const createMutation = useMutation({
		mutationFn: setupGame,
		onSuccess: (newGame) => {
			navigate({
				to: "/$gameId/waiting",
				params: { gameId: newGame.id },
			});
		},
	});

	const joinMutation = useMutation({
		mutationFn: joinGame,
		onSuccess: () => {
			navigate({ to: "/$gameId/waiting", params: { gameId } });
		},
	});

	// Helper function to extract friendly error messages from Zod / Server errors
	const getErrorMessage = (err: unknown) => {
		if (err instanceof Error) {
			try {
				const parsed = JSON.parse(err.message);
				if (Array.isArray(parsed)) {
					return parsed[0].message;
				}
			} catch {
				return err.message;
			}
		}
		return "An unexpected error occurred.";
	};

	const createErrorMsg = createMutation.error
		? getErrorMessage(createMutation.error)
		: null;
	const joinErrorMsg = joinMutation.error
		? getErrorMessage(joinMutation.error)
		: null;

	return (
		<div className="flex justify-center p-10">
			<div className="text-lg">
				<h1 className="col-span-2 text-center text-4xl font-bold">
					Desert Survival Board Game
				</h1>
				<form
					className="mt-3 w-full rounded-lg border p-3 *:w-full"
					onSubmit={(e) => {
						e.preventDefault();
						createMutation.mutate({
							data: { playerCount, difficulty, playerName },
						});
					}}
				>
					<h2 className="text-center text-2xl font-bold underline underline-offset-5">
						Create Game
					</h2>

					<fieldset className="space-y-2">
						<legend>How many players?</legend>
						<div className="flex gap-2">
							{[2, 3, 4, 5].map((n) => (
								<label key={n} className="relative w-full cursor-pointer">
									<input
										type="radio"
										value={n}
										name="playerCount"
										checked={playerCount === n}
										onChange={() => setPlayerCount(n)}
										required
										className="peer sr-only"
									/>

									<span className="flex w-full items-center justify-center rounded-lg border p-2 font-semibold shadow-sm peer-checked:bg-amber-600 peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500 peer-focus-visible:ring-offset-2 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-700 motion-safe:transition-all">
										{n}
									</span>
								</label>
							))}
						</div>
					</fieldset>

					<fieldset className="mt-2 space-y-2">
						<legend>What difficulty?</legend>

						<div className="flex gap-2">
							{difficulties.map((diff) => (
								<label key={diff} className="relative w-full cursor-pointer">
									<input
										type="radio"
										value={diff}
										name="difficulty"
										checked={difficulty === diff}
										onChange={() => setDifficulty(diff)}
										required
										className="peer sr-only"
									/>

									<span className="flex w-full items-center justify-center rounded-lg border p-2 font-semibold shadow-sm peer-checked:bg-amber-600 peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500 peer-focus-visible:ring-offset-2 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-700 motion-safe:transition-all">
										{diff}
									</span>
								</label>
							))}
						</div>
					</fieldset>

					<div className="mt-1">
						<label>
							Host Name
							<input
								id="hostName"
								type="text"
								value={playerName}
								onChange={(e) => setPlayerName(e.target.value)}
								minLength={1}
								maxLength={10}
								required
								className="mt-2 w-full rounded-lg border px-3 py-2"
								placeholder="1 - 10 characters"
							/>
						</label>
					</div>

					<p className={`${!createErrorMsg && "invisible"} text-red-500`}>
						{createErrorMsg ?? "Error placeholder"}
					</p>

					<button
						type="submit"
						disabled={createMutation.isPending}
						className="mt-3 rounded-lg border bg-amber-600 px-3 py-2 text-xl text-black hover:bg-amber-500 active:bg-amber-700 motion-safe:transition"
					>
						{createMutation.isPending ? "Setting up..." : "Create Game"}
					</button>
				</form>

				<form
					className="mt-10 w-full justify-between rounded-lg border p-3 *:w-full"
					onSubmit={(e) => {
						e.preventDefault();
						joinMutation.mutate({ data: { gameId, playerName } });
					}}
				>
					<h2 className="text-center text-2xl font-bold underline underline-offset-5">
						Join Game
					</h2>
					<div className="mt-1">
						<label htmlFor="gameId" className="block">
							Game ID
						</label>
						<input
							id="gameId"
							className="mt-2 w-full rounded-lg border px-3 py-2"
							type="text"
							value={gameId}
							onChange={(e) => setGameId(e.target.value)}
							placeholder="8 characters"
							minLength={8}
							maxLength={8}
							required
						/>
					</div>

					<div className="mt-1">
						<label htmlFor="playerName" className="block">
							Player Name
						</label>
						<input
							id="playerName"
							className="mt-2 w-full rounded-lg border px-3 py-2"
							type="text"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
							placeholder="1 - 10 characters"
							minLength={1}
							maxLength={10}
							required
						/>
					</div>

					<p className={`${!joinErrorMsg && "invisible"} text-red-500`}>
						{joinErrorMsg ?? "Error placeholder"}
					</p>

					<button
						type="submit"
						disabled={joinMutation.isPending}
						className={`mt-3 rounded-lg border bg-amber-600 px-3 py-2 text-xl text-black ${
							joinMutation.isPending
								? "cursor-not-allowed brightness-50"
								: "hover:bg-amber-500 active:bg-amber-700"
						} motion-safe:transition`}
					>
						{joinMutation.isPending ? "Joining..." : "Join Game"}
					</button>
				</form>
			</div>
		</div>
	);
}
