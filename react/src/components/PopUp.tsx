export default function PopUp(props: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 motion-safe:transition-all motion-safe:ease-in-out ${props.className}`}
		>
			<div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
				{props.children}
			</div>
		</div>
	);
}
