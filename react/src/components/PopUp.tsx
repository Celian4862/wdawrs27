export default function PopUp({
	show,
	heading,
	description,
	defeat = false,
	className,
	children,
}: {
	show: boolean;
	heading: string;
	description: React.ReactNode;
	defeat?: boolean;
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<div
			className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 motion-safe:transition-all motion-safe:ease-in-out ${
				show
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'
			} ${className ?? ''}`}
		>
			<div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
				<h3 className={`text-2xl font-bold ${defeat ? 'text-red-600' : ''}`}>
					{heading}
				</h3>
				<p className="text-slate-300">{description}</p>
				{children}
			</div>
		</div>
	);
}
