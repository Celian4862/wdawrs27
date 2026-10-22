export default function ConfirmModalButtons({
	confirmMessage,
	onConfirm,
	onCancel,
	victory,
	className = 'bg-red-600 hover:bg-red-500 active:bg-red-700',
}: {
	confirmMessage: string;
	onConfirm: () => void;
	onCancel?: () => void;
	victory?: boolean;
	className?: string;
}) {
	return (
		<div className="flex flex-col justify-center gap-3 pt-2 md:flex-row">
			<button
				type="button"
				className={`rounded-lg px-5 py-2 font-bold motion-safe:transition ${className ?? ''}`}
				onClick={onConfirm}
			>
				{confirmMessage}
			</button>
			{!victory ? (
				<button
					type="button"
					className="rounded-lg border px-5 py-2 hover:bg-slate-700 active:bg-slate-800 motion-safe:transition"
					onClick={onCancel}
				>
					Cancel
				</button>
			) : (
				''
			)}
		</div>
	);
}
