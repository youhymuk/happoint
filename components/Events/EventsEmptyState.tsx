'use client';

import Link from 'next/link';

export default function EventsEmptyState() {
	return (
		<div className='rounded-lg border border-border bg-white p-12 text-center'>
			<div className='mx-auto mb-4 max-w-md'>
				<div className='mb-4 text-6xl'>📅</div>
				<h3 className='mb-2 text-xl font-semibold text-primary'>
					No events yet
				</h3>
				<p className='mb-6 text-secondary'>
					Create your first event to start managing appointments
				</p>
				<Link
					href='/events/new'
					className='btn-primary inline-block rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90'
				>
					Create Your First Event
				</Link>
			</div>
		</div>
	);
}
