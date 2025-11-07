type LoadingSpinnerProps = {
	className?: string;
};

export default function LoadingSpinner({
	className = '',
}: LoadingSpinnerProps) {
	return (
		<div className='flex min-h-screen items-center justify-center'>
			<div
				className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary h-10 w-10 ${className}`}
				role='status'
				aria-label='Loading'
			/>
		</div>
	);
}
