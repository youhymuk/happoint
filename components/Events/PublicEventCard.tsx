import { PublicEventType } from '@/types/events';
import Link from 'next/link';

type PublicEventCardProps = {
	event: PublicEventType;
};

export default function PublicEventCard({
	event: { id, name, description, clerkUserId, durationInMinutes },
}: PublicEventCardProps) {
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
			</div>
			<div className='mt-4 flex items-center gap-4 text-sm text-muted'>
				<span>⏱️ {durationInMinutes} min</span>
			</div>
			<div className='mt-4 flex items-center gap-2 border-t border-border pt-4'>
				<Link
					href={`/book/${clerkUserId}/${id}`}
					className='flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-header-bg hover:text-primary'
				>
					Select
				</Link>
			</div>
		</article>
	);
}
