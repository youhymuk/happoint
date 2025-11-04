import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

import { getEvents } from '@/server/actions/events';

export default async function EventsPage() {
	const { userId, redirectToSignIn } = await auth();

	if (!userId) return redirectToSignIn();

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

			{events.length > 0 ? (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{events.map((event) => (
						<Link
							key={event.id}
							href={`/events/${event.id}`}
							className='group rounded-lg border border-border bg-white p-6 shadow-sm transition-all hover:border-primary hover:shadow-md'
						>
							<div className='mb-4 flex items-start justify-between'>
								<div>
									<h3 className='text-lg font-semibold text-primary group-hover:text-primary'>
										{event.name}
									</h3>
									{event.description && (
										<p className='mt-1 text-sm text-secondary line-clamp-2'>
											{event.description}
										</p>
									)}
								</div>
								{event.isActive ? (
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
								<span>⏱️ {event.durationInMinutes} min</span>
								<span className='text-muted'>•</span>
								<span className='text-muted'>
									{new Date(event.createdAt).toLocaleDateString()}
								</span>
							</div>
						</Link>
					))}
				</div>
			) : (
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
			)}
		</section>
	);
}
