type PlusIconProps = {
	className?: string;
};

export default function PlusIcon({ className }: PlusIconProps) {
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
				d='M12 4v16m8-8H4'
			/>
		</svg>
	);
}

