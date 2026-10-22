export default function PopUp({
	show,
	heading,
	description,
	victory,
	className,
	children,
}: {
	show: boolean;
	heading: string;
	description: React.ReactNode;
	victory?: boolean;
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm motion-safe:transition-all motion-safe:ease-in-out ${
				show
					? 'pointer-events-auto opacity-100'
					: 'pointer-events-none opacity-0'
			} ${className ?? ''}`}
		>
			<div className="w-full max-w-md space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
				<h3
					className={`text-2xl font-bold ${victory === false ? 'text-red-600' : victory === true ? 'text-green-400' : ''}`}
				>
					{heading}
				</h3>
				<p className="text-slate-300">{description}</p>
				{children}
			</div>
		</div>
	);
}
