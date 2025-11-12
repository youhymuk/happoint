import { EventType } from '@/types/events';
import Link from 'next/link';

type SlotsEmptyStateProps = {
	event: EventType;
	calendarUser: {
		id: string;
		fullName: string | null;
	};
};

export default function SlotsEmptyState({
	event: { name: eventName, description: eventDescription },
	calendarUser: { id: calendarUserId, fullName: calendarUserFullName = 'user' },
}: SlotsEmptyStateProps) {
	return (
		<div>
			<div>
				<h3>
					Book {eventName} with {calendarUserFullName}
				</h3>
				{eventDescription && <p>{eventDescription}</p>}
			</div>
			<p>
				{calendarUserFullName} is currently booked up. Please try again later or
				book a different time.
			</p>
			<Link href={`/book/${calendarUserId}`}>Choose another event</Link>
		</div>
	);
}
