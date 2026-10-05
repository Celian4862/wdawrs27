import { tiles } from '../data/tiles';

export default function Board({ className }: { className?: string }) {
	return (
		<section
			className={`overflow-x-auto [-webkit-overflow-scrolling:touch] ${className ?? ''}`}
		>
			<div className="min-w-115 lg:fixed w-fit grid grid-cols-5 gap-5">
				{tiles.map((tile) => (
					<button
						key={tile.id}
						type="button"
						disabled={!tile.info}
						className={`border rounded-lg size-20 motion-safe:transition ${!tile.info ? 'brightness-50 cursor-not-allowed' : 'hover:brightness-50'}`}
					>
						{!tile.info && '🌪'}
					</button>
				))}
			</div>
		</section>
	);
}
