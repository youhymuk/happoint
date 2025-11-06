import Link from 'next/link';

import EventCard from '@/components/Events/EventCard';
import EventsEmptyState from '@/components/Events/EventsEmptyState';
import { getEvents } from '@/server/actions/events';
import { requireAuthWithRedirect } from '@/server/utils';

export default async function EventsPage() {
	const { userId } = await requireAuthWithRedirect();

	const events = await getEvents(userId);

	return (
		<section className='container mx-auto px-4 py-8'>
			<div className='mb-8 flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-primary'>Events</h1>
					<p className='mt-2 text-secondary'>
						Manage your events and appointment types
					</p>
				</div>
				<Link
					href='/events/new'
					className='btn-accent rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90'
				>
					+ New Event
				</Link>
			</div>
			{!!events?.length ? (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{events.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</div>
			) : (
				<EventsEmptyState />
			)}
		</section>
	);
}
