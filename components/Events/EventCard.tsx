'use client';

import Link from 'next/link';

import CopyButton from '../CopyButton';
import EditIcon from '../icons/EditIcon';

type EventCardProps = {
	event: {
		id: string;
		name: string;
		description: string | null;
		isActive: boolean;
		durationInMinutes: number;
		createdAt: Date;
		clerkUserId: string;
		updatedAt: Date;
	};
};

export default function EventCard({
	event: {
		id,
		name,
		description,
		isActive,
		durationInMinutes,
		createdAt,
		clerkUserId,
	},
}: EventCardProps) {
	const linkToCopy =
		typeof window !== 'undefined'
			? `${window.location.origin}/book/${clerkUserId}/${id}`
			: '';

	return (
		<article className='group rounded-lg border border-border bg-white p-6 shadow-sm transition-all'>
			<div className='mb-4 flex items-start justify-between'>
				<div>
					<h3 className='text-lg font-semibold text-primary group-hover:text-primary'>
						{name}
					</h3>
					{description && (
						<p className='mt-1 text-sm text-secondary line-clamp-2'>
							{description}
						</p>
					)}
				</div>
				{isActive ? (
					<span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
						Active
					</span>
				) : (
					<span className='rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800'>
						Inactive
					</span>
				)}
			</div>
			<div className='mt-4 flex items-center gap-4 text-sm text-muted'>
				<span>⏱️ {durationInMinutes} min</span>
				<span className='text-muted'>•</span>
				<span className='text-muted'>
					{new Date(createdAt).toLocaleDateString()}
				</span>
			</div>
			<div className='mt-4 flex items-center gap-2 border-t border-border pt-4'>
				<CopyButton
					value={linkToCopy}
					className='flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-header-bg hover:text-primary'
				/>
				<Link
					href={`/events/${id}/edit`}
					className='flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-header-bg hover:text-primary'
				>
					<EditIcon />
					<span>Edit</span>
				</Link>
			</div>
		</article>
	);
}
