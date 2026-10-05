export default function GameInfoSection({
	children,
}: {
	children: React.ReactNode;
}) {
	return <section className="border rounded-xl p-6">{children}</section>;
}
