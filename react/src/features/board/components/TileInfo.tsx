import type { TileType } from '../tileTypes';

const actions = [
	'Move',
	'Remove Sand',
	'Reveal',
	'Collect Piece',
] as const;

export default function TileInfo(props: {
	tile?: TileType;
	className?: string;
}) {
	const info = props.tile?.info;

	return (
		<section
			className={`grid grid-cols-1 gap-4 lg:grid-cols-2 ${props.className}`}
		>
			<div className="min-h-24 rounded-lg border border-white/15 bg-white/5 p-4">
				{info && (
					<dl className="space-y-2 text-sm text-white/80">
						<div>
							<dt className="inline font-semibold text-white">Tile: </dt>
							<dd className="inline">{info.unrevealedType}</dd>
						</div>
						{info.revealed && (
							<div>
								<dt className="inline font-semibold text-white">
									Revealed as:{' '}
								</dt>
								<dd className="inline">{info.revealedType}</dd>
							</div>
						)}
						{info.revealed && info.revealedType === 'Hint' && (
							<div>
								<dt className="inline font-semibold text-white">Hint: </dt>
								<dd className="inline">{info.hintVariant}</dd>
							</div>
						)}
					</dl>
				)}
			</div>
			<div className="grid grid-cols-2 gap-2">
				{actions.map((action) => (
					<button
						key={action}
						type="button"
						className="min-h-11 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
					>
						{action}
					</button>
				))}
			</div>
		</section>
	);
}
