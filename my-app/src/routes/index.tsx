import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { Difficulty } from "#/server/features/hurricane/types";
import { setupGame } from "#/server/game.functions";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [playerCount, setPlayerCount] = useState(2);
	const [difficulty, setDifficulty] = useState<Difficulty>("easy");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	return (
		<div className="mt-10 flex justify-center">
			<div className="mt-4 flex flex-col items-center gap-3 text-lg">
				<h1 className="text-4xl font-bold">Desert Survival Board Game</h1>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						setError(null);

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
										setError(error[0].message);
									}
								} catch {
									setError(err.message);
								}
							} else {
								setError("An unexpected error occurred.");
							}
						} finally {
							setLoading(false);
						}
					}}
					className="border rounded-lg p-3 w-full *:w-full"
				>
					<h2 className="text-center text-2xl font-bold underline underline-offset-5">
						Create Game
					</h2>

					<div className="mt-1">
						<label htmlFor="playerCount" className="block">
							How many will play?
						</label>
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
							className="rounded-lg border mt-2 w-full px-3 py-2"
							placeholder="2 - 5 players"
						/>
					</div>

					<div className="mt-3">
						<label htmlFor="difficulty" className="block">
							What difficulty?
						</label>
						<select
							id="difficulty"
							value={difficulty}
							onChange={(e) => setDifficulty(e.target.value as Difficulty)}
							required
							className="rounded-lg border mt-2 w-full px-3 py-2 *:bg-black"
						>
							<option value="easy">Easy</option>
							<option value="normal">Normal</option>
							<option value="hard">Hard</option>
							<option value="expert">Expert</option>
						</select>
					</div>

					<p className={`${!error && "invisible"} text-red-500`}>
						{error ?? "Error placeholder"}
					</p>

					<button
						type="submit"
						disabled={loading}
						className="mt-3 rounded-lg border px-3 py-2 text-xl hover:bg-green-500 motion-safe:transition active:bg-green-300 bg-green-700"
					>
						{loading ? "Setting up..." : "Create Game"}
					</button>
				</form>

				<form
					onSubmit={async (e) => {
						e.preventDefault();
					}}
					className="mt-3 border rounded-lg p-3"
				>
					<div>
						<label>
							Game ID
							<br />
							<input
								className="rounded-lg border px-3 py-2"
								type="text"
								placeholder="abcd1234"
							/>
						</label>
					</div>
					<button
						type="submit"
						className="rounded-lg border mt-3 px-3 py-2 text-xl hover:scale-110 motion-safe:transition active:bg-white/30"
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}
