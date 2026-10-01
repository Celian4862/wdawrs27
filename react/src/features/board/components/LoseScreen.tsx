export default function LoseScreen() {
	return (
		<div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl border border-rose-400/30 bg-slate-900/90 p-8 text-center shadow-2xl shadow-black/60">
				<p className="text-xs font-semibold tracking-[0.25em] text-rose-300 uppercase">
					Game over
				</p>
				<h2 className="mt-3 text-4xl font-black text-white">
					The expedition failed
				</h2>
				<p className="mt-4 text-base text-slate-300">
					The players lost because the hurricane reached the skull, a thirst
					check left someone below 0 water, or the sand mark pile was exhausted.
				</p>
			</div>
		</div>
	);
}
