import Link from 'next/link';

import EventForm from '@/components/forms/EventForm';

export default function NewEventPage() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<Link
				href='/events'
				className='mb-6 inline-flex items-center text-sm text-secondary transition-colors hover:text-primary'
			>
				← Back to Events
			</Link>
			<h1 className='mb-2 text-3xl font-bold text-primary'>Create New Event</h1>
			<p className='mb-8 text-secondary'>
				Set up a new appointment type for your schedule
			</p>
			<EventForm />
		</div>
	);
}
