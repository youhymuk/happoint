import { requireAuthWithRedirect } from '@/app/lib/utils';
import EventForm from '@/components/forms/EventForm';
import { getEvent } from '@/server/actions/events';

export default async function EditEventPage({
	params,
}: {
	params: Promise<{ eventId: string }>;
}) {
	const { userId } = await requireAuthWithRedirect();

	const { eventId } = await params;

	const event = await getEvent(eventId, userId);

	if (!event) return <h1 className='text-2xl font-bold'>Event not found</h1>;

	return (
		<article className='container mx-auto px-4 py-8'>
			<h1 className='mb-2 text-center text-3xl font-bold text-primary'>
				Edit Event
			</h1>
			<EventForm
				event={{
					...event,
					description: event.description ?? undefined,
				}}
			/>
		</article>
	);
}
