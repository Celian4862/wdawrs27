import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { difficulties } from "#/server/features/hurricane/data";
import type { Difficulty } from "#/server/features/hurricane/types";
import { joinGame, setupGame } from "#/server/game.functions";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [playerCount, setPlayerCount] = useState(2);
	const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
	const [loading, setLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [gameId, setGameId] = useState("");
	const [playerName, setPlayerName] = useState("");
	const [joinError, setJoinError] = useState<string | null>(null);
	const navigate = useNavigate();

	return (
		<div className="flex justify-center p-10">
			<div className="text-lg">
				<h1 className="col-span-2 text-center text-4xl font-bold">
					Desert Survival Board Game
				</h1>
				<form
					className="mt-3 w-full rounded-lg border p-3 *:w-full"
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						setCreateError(null);
						setJoinError(null);

						try {
							const newGame = await setupGame({
								data: { playerCount, difficulty, playerName },
							});

							// Navigate to the dynamic route
							navigate({
								to: "/$gameId/waiting",
								params: { gameId: newGame.id },
							});
						} catch (err) {
							if (err instanceof Error) {
								console.error(err);
								try {
									const error = JSON.parse(err.message);
									if (Array.isArray(error)) {
										setCreateError(error[0].message);
									}
								} catch {
									setCreateError(err.message);
								}
							} else {
								setCreateError("An unexpected error occurred.");
							}
						} finally {
							setLoading(false);
						}
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
										onChange={() => setPlayerCount(n)}
										required
										className="peer sr-only"
									/>

									<span className="flex w-full items-center justify-center rounded-lg border p-2 font-semibold shadow-sm peer-checked:bg-amber-600 peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500 peer-focus-visible:ring-offset-2 hover:border-amber-500 hover:text-amber-600 motion-safe:transition-all">
										{n}
									</span>
								</label>
							))}
						</div>
					</fieldset>

					<fieldset className="mt-2 space-y-2">
						<legend>What difficulty?</legend>

						<div className="flex gap-2">
							{difficulties.map((difficulty) => (
								<label
									key={difficulty}
									className="relative w-full cursor-pointer"
								>
									<input
										type="radio"
										value={difficulty}
										name="difficulty"
										onChange={() => setDifficulty(difficulty)}
										required
										className="peer sr-only"
									/>

									<span className="flex w-full items-center justify-center rounded-lg border p-2 font-semibold shadow-sm peer-checked:bg-amber-600 peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500 peer-focus-visible:ring-offset-2 hover:border-amber-500 motion-safe:transition-all">
										{difficulty}
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
								min={1}
								max={10}
								required
								className="mt-2 w-full rounded-lg border px-3 py-2"
								placeholder="1 - 10 characters"
							/>
						</label>
					</div>

					<p className={`${!createError && "invisible"} text-red-500`}>
						{createError ?? "Error placeholder"}
					</p>

					<button
						type="submit"
						disabled={loading}
						className="mt-3 rounded-lg border bg-amber-600 px-3 py-2 text-xl text-black hover:bg-amber-500 active:bg-amber-700 motion-safe:transition"
					>
						{loading ? "Setting up..." : "Create Game"}
					</button>
				</form>

				<form
					className="mt-10 w-full justify-between rounded-lg border p-3 *:w-full"
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						setCreateError(null);
						setJoinError(null);

						try {
							await joinGame({ data: { gameId, playerName } });

							navigate({ to: "/$gameId/waiting", params: { gameId } });
						} catch (err) {
							if (err instanceof Error) {
								console.error(err);
								try {
									const error = JSON.parse(err.message);
									if (Array.isArray(error)) {
										setJoinError(error[0].message);
									}
								} catch {
									setJoinError(err.message);
								}
							} else {
								setCreateError("An unexpected error occurred.");
							}
						} finally {
							setLoading(false);
						}
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

					<p className={`${!joinError && "invisible"} text-red-500`}>
						{joinError ?? "Error placeholder"}
					</p>

					<button
						type="submit"
						disabled={loading}
						className={`mt-3 rounded-lg border bg-amber-600 px-3 py-2 text-xl text-black ${loading ? "cursor-not-allowed brightness-50" : "hover:bg-amber-500 active:bg-amber-700"} motion-safe:transition`}
					>
						Join Game
					</button>
				</form>
			</div>
		</div>
	);
}
