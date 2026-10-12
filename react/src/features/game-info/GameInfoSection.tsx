export default function GameInfoSection({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<section className={`border rounded-xl p-6 ${className ?? ''}`}>
			{children}
		</section>
	);
}
