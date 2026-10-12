export default function GameInfoHeading({
	heading,
	subheading,
	className,
}: {
	heading: string;
	subheading: string;
	className?: string;
}) {
	return (
		<div
			className={`flex flex-wrap items-center justify-between pb-6 ${className ?? ''}`}
		>
			<h1 className="text-2xl">{heading}</h1>
			<h2 className="text-xl">{subheading}</h2>
		</div>
	);
}
