import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { Difficulty } from "#/server/features/hurricane/types";
import { setupGame } from "#/server/game.functions";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [playerCount, setPlayerCount] = useState(2);
	const [difficulty, setDifficulty] = useState<Difficulty>("easy");
	const [loading, setLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	const [joinError, setJoinError] = useState<string | null>(null);
	const navigate = useNavigate();

	return (
		<div className="flex justify-center">
			<div className="mt-10 text-lg">
				<h1 className="col-span-2 text-center text-4xl font-bold">
					Desert Survival Board Game
				</h1>
				<form
					className="mt-3 w-full rounded-lg border p-3 *:w-full"
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						setCreateError(null);

						try {
							const newGame = await setupGame({
								data: { playerCount, difficulty },
							});

							// Navigate to the dynamic route
							navigate({ to: "/$gameId", params: { gameId: newGame.id } });
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

					<div className="mt-1">
						<label>
							How many will play?
							<input
								id="playerCount"
								type="number"
								value={playerCount}
								onChange={(e) =>
									setPlayerCount(Number.parseInt(e.target.value, 10))
								}
								min="2"
								max="5"
								required
								className="mt-2 w-full rounded-lg border px-3 py-2"
								placeholder="2 - 5 players"
							/>
						</label>
					</div>

					<div className="mt-3">
						<label>
							What difficulty?
							<select
								id="difficulty"
								value={difficulty}
								onChange={(e) => setDifficulty(e.target.value as Difficulty)}
								required
								className="mt-2 w-full rounded-lg border px-3 py-2 *:bg-black"
							>
								<option value="easy">Easy</option>
								<option value="normal">Normal</option>
								<option value="hard">Hard</option>
								<option value="expert">Expert</option>
							</select>
						</label>
					</div>

					<p className={`${!createError && "invisible"} text-red-500`}>
						{createError ?? "Error placeholder"}
					</p>

					<button
						type="submit"
						disabled={loading}
						className="mt-3 rounded-lg border bg-green-700 px-3 py-2 text-xl hover:bg-green-500 active:bg-green-300 motion-safe:transition"
					>
						{loading ? "Setting up..." : "Create Game"}
					</button>
				</form>

				<form
					className="mt-10 w-full justify-between rounded-lg border p-3 *:w-full"
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						setJoinError(null);

						try {
							// Navigate to the dynamic route
							navigate({ to: "/" });
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
						Join Game
					</h2>
					<div className="mt-1">
						<label htmlFor="gameID" className="block">
							Game ID
						</label>
						<input
							id="gameID"
							className="mt-2 w-full rounded-lg border px-3 py-2"
							type="text"
							placeholder="8 characters"
							minLength={8}
							maxLength={8}
							required
						/>
					</div>

					<p className={`${!joinError && "invisible"} text-red-500`}>
						{joinError ?? "Error placeholder"}
					</p>

					<button
						type="submit"
						className="mt-3 rounded-lg border bg-green-700 px-3 py-2 text-xl hover:bg-green-500 active:bg-green-300 motion-safe:transition"
					>
						Join Game
					</button>
				</form>
			</div>
		</div>
	);
}
