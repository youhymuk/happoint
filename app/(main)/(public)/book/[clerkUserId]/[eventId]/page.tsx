import { clerkClient } from '@clerk/nextjs/server';
import {
	addYears,
	eachMinuteOfInterval,
	endOfDay,
	roundToNearestMinutes,
} from 'date-fns';

import MeetingForm from '@/components/forms/MeetingForm';
import SlotsEmptyState from '@/components/SlotsEmtyState';
import { getEvent } from '@/server/actions/events';
import { getValidScheduleTimeSlots } from '@/server/actions/schedule';

export default async function BookingPage({
	params,
}: {
	params: Promise<{ clerkUserId: string; eventId: string }>;
}) {
	const { clerkUserId, eventId } = await params;
	const event = await getEvent(eventId, clerkUserId);

	if (!event) return <h1>this event does&#39nt exist anymore</h1>;

	//TODO: move to the utility fn
	const client = await clerkClient();
	const calendarUser = await client.users.getUser(clerkUserId);

	const start = roundToNearestMinutes(new Date(), {
		nearestTo: 15, //TODO: magic number, move to a constant
		roundingMethod: 'ceil',
	});
	const end = endOfDay(addYears(start, 1));

	const validTimeSlots = await getValidScheduleTimeSlots(
		eachMinuteOfInterval({ start, end }, { step: 15 }), //TODO: magic number
		event
	);

	if (!validTimeSlots.length)
		return <SlotsEmptyState event={event} calendarUser={calendarUser} />;

	return (
		<div>
			<h3>
				Book {event.name} with {calendarUser.fullName}
			</h3>
			{event.description && <p>{event.description}</p>}
			<MeetingForm
				validSlots={validTimeSlots}
				eventId={eventId}
				clerkUserId={clerkUserId}
			/>
		</div>
	);
}
