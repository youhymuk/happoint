type ErrorIconProps = {
	className?: string;
};

export default function ErrorIcon({ className }: ErrorIconProps) {
	return (
		<svg
			className={className}
			width={16}
			height={16}
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
			/>
		</svg>
	);
}

