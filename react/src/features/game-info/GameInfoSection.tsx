export default function GameInfoSection({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<section className={`rounded-xl border p-6 ${className ?? ''}`}>
			{children}
		</section>
	);
}
