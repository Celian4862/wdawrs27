export default function Setup(props: {
	heading: string;
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-dvh flex justify-center">
			<div className="w- flex flex-col justify-center">
				<div className="text-center">
					<h1 className="text-2xl pb-6">{props.heading}</h1>
					<div className="grid grid-cols-2 gap-3">{props.children}</div>
				</div>
			</div>
		</div>
	);
}
