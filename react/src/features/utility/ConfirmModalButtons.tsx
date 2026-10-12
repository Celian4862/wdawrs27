export default function ConfirmModalButtons({
	confirmMessage,
	onConfirm,
	onCancel,
	defeat = false,
}: {
	confirmMessage: string;
	onConfirm: () => void;
	onCancel?: () => void;
	defeat?: boolean;
}) {
	return (
		<div className="pt-2 flex flex-col gap-3 justify-center md:flex-row">
			<button
				type="button"
				className="px-5 py-2 bg-red-600 font-bold rounded-lg hover:bg-red-500 active:bg-red-700 motion-safe:transition"
				onClick={onConfirm}
			>
				{confirmMessage}
			</button>
			{!defeat ? (
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
