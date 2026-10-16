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
		<div className="pt-2 flex flex-col gap-3 justify-center md:flex-row">
			<button
				type="button"
				className={`px-5 py-2 font-bold rounded-lg motion-safe:transition ${className ?? ''}`}
				onClick={onConfirm}
			>
				{confirmMessage}
			</button>
			{!victory ? (
				<button
					type="button"
					className="px-5 py-2 border rounded-lg hover:bg-slate-700 active:bg-slate-800 motion-safe:transition"
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
