import type { PartNames } from "#/server/features/board/types";

export default function Parts({
	partsCollected,
}: {
	partsCollected: PartNames[];
}) {
	return (
		<section className="rounded-xl border p-6">
			<div className="flex flex-wrap items-center justify-between">
				<h1 className="text-2xl">Parts Collected</h1>
				<h2 className="text-xl">{partsCollected.length} / 4</h2>
			</div>
			<div className="flex flex-wrap gap-2 mt-3">
				{partsCollected.map((part) => (
					<div key={part} className="rounded-lg border p-3">
						{part}
					</div>
				))}
			</div>
		</section>
	);
}
