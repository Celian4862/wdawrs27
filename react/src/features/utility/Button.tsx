interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
	return (
		<button type="button" className={className} {...props}>
			{children}
		</button>
	);
}
