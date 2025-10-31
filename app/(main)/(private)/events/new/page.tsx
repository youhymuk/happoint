import EventForm from '@/components/forms/EventForm';
import Link from 'next/link';

export default function NewEventPage() {
	return (
		<section>
			<Link href='/events' className='text-blue-500'>
				Go back
			</Link>
			<h1>New Event</h1>
			<article>
				<h2>New Event</h2>
				<EventForm />
			</article>
		</section>
	);
}
