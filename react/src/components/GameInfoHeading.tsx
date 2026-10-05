export default function GameInfoHeading(props: {
	heading: string;
	subheading: string;
}) {
	return (
		<div className="flex flex-col md:flex-row md:items-center md:justify-between">
			<h1 className="text-2xl md:pb-6">{props.heading}</h1>
			<h2 className="pb-6 text-xl">{props.subheading}</h2>
		</div>
	);
}
