import Link from 'next/link';

export default function Logo() {
	return (
		<Link
			href='/'
			className='flex items-end gap-1 font-bold text-[2rem] leading-[0.8] tracking-tighter'
		>
			<span className='inline-block w-8 h-8 rounded-tr-2xl rounded-bl-2xl bg-primary' />{' '}
			happoint
		</Link>
	);
}
