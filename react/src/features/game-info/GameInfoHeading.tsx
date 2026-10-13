export default function GameInfoHeading({
	heading,
	subheading,
	className = 'pb-6',
}: {
	heading: string;
	subheading: string;
	className?: string;
}) {
	return (
		<div
			className={`flex flex-wrap items-center justify-between ${className ?? ''}`}
		>
			<h1 className="text-2xl">{heading}</h1>
			<h2 className="text-xl">{subheading}</h2>
		</div>
	);
}
