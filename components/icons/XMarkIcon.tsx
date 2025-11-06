type XMarkIconProps = {
	className?: string;
};

export default function XMarkIcon({ className }: XMarkIconProps) {
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
				d='M6 18L18 6M6 6l12 12'
			/>
		</svg>
	);
}

