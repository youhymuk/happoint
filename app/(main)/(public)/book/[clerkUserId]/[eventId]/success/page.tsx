import { formatDateTime } from '@/lib/formatters';
import { getEvent } from '@/server/actions/events';
import { clerkClient } from '@clerk/nextjs/server';

type SuccessPageProps = {
	params: Promise<{ clerkUserId: string; eventId: string }>;
	searchParams: Promise<{ startTime: string }>;
};

export default async function SuccessPage({
	params,
	searchParams,
}: SuccessPageProps) {
	const { clerkUserId, eventId } = await params;
	const { startTime } = await searchParams;

	const event = await getEvent(eventId, clerkUserId);

	if (!event) return <h1>this event does&#39nt exist anymore</h1>;

	const client = await clerkClient();
	const calendarUser = await client.users.getUser(clerkUserId); //TODO: move to the utility fn

	const startTimeDate = new Date(startTime);

	return (
		<div>
			<h1>
				{event.name} with {calendarUser.fullName} booked successfully
			</h1>
			<p>{formatDateTime(startTimeDate)}</p>
			<p>
				You should receive an email confirmation shortly. You can safely close
				this page now.
			</p>
		</div>
	);
}
